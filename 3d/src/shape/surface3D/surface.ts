import {
  ShaderMaterial,
  BufferGeometry,
  Mesh,
  VertexAttributeBufferIndex,
  VertexAttributeLocation,
  VertexStepMode,
  Format,
  TextureDimension,
  TextureUsage,
} from "@antv/g-plugin-3d";
import { Coordinate3D } from "@antv/coord";
import { ShapeComponent as SC, select } from "@antv/g2";
import { applyStyle, nextPow2, toOpacityKey } from "../utils";
import ndarray from "ndarray";
import ops from "ndarray-ops";
import pack from "ndarray-pack";
import gradient from "ndarray-gradient";
import colormap from "colormap";

const SURFACE_VERTEX_SIZE = 4 * (4 + 3 + 3);
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const QUAD = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
  [1, 0],
  [0, 1],
];
const PERMUTATIONS = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

(function () {
  for (let i = 0; i < 3; ++i) {
    const p = PERMUTATIONS[i];
    const u = (i + 1) % 3;
    const v = (i + 2) % 3;
    p[u + 0] = 1;
    p[v + 3] = 1;
    p[i + 6] = 1;
  }
})();

const UNIFORMS = {
  model: IDENTITY,
  view: IDENTITY,
  projection: IDENTITY,
  inverseModel: IDENTITY.slice(),
  lowerBound: [0, 0, 0],
  upperBound: [0, 0, 0],
  colorMap: 0,
  clipBounds: [
    [0, 0, 0],
    [0, 0, 0],
  ],
  height: 0.0,
  contourTint: 0,
  contourColor: [0, 0, 0, 1],
  permutation: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  zOffset: -1e-4,
  objectOffset: [0, 0, 10],
  kambient: 1,
  kdiffuse: 1,
  kspecular: 1,
  lightPosition: [1000, 1000, 1000],
  eyePosition: [0, 0, 0],
  roughness: 1,
  fresnel: 1,
  opacity: 1,
  vertexColor: 0,
};

function assign(dstField: ndarray.NdArray<Float32Array>, srcField: ndarray.NdArray<Float32Array>) {
  dstField.data.set(srcField.data);
}

const N_COLORS = 16;
const padField = function (dstField: ndarray.NdArray<Float32Array>, srcField: ndarray.NdArray<Float32Array>) {
  const srcShape = srcField.shape.slice();
  const dstShape = dstField.shape.slice();

  // Center
  ops.assign(dstField.lo(1, 1).hi(srcShape[0], srcShape[1]), srcField);

  // Edges
  ops.assign(dstField.lo(1).hi(srcShape[0], 1), srcField.hi(srcShape[0], 1));
  ops.assign(dstField.lo(1, dstShape[1] - 1).hi(srcShape[0], 1), srcField.lo(0, srcShape[1] - 1).hi(srcShape[0], 1));
  ops.assign(dstField.lo(0, 1).hi(1, srcShape[1]), srcField.hi(1));
  ops.assign(dstField.lo(dstShape[0] - 1, 1).hi(1, srcShape[1]), srcField.lo(srcShape[0] - 1));
  // Corners
  dstField.set(0, 0, srcField.get(0, 0));
  dstField.set(0, dstShape[1] - 1, srcField.get(0, srcShape[1] - 1));
  dstField.set(dstShape[0] - 1, 0, srcField.get(srcShape[0] - 1, 0));
  dstField.set(dstShape[0] - 1, dstShape[1] - 1, srcField.get(srcShape[0] - 1, srcShape[1] - 1));
};

function getOpacityFromScale(ratio, opacityscale) {
  // copied form gl-mesh3d
  if (!opacityscale) return 1;
  if (!opacityscale.length) return 1;

  for (let i = 0; i < opacityscale.length; ++i) {
    if (opacityscale.length < 2) return 1;
    if (opacityscale[i][0] === ratio) return opacityscale[i][1];
    if (opacityscale[i][0] > ratio && i > 0) {
      const d = (opacityscale[i][0] - ratio) / (opacityscale[i][0] - opacityscale[i - 1][0]);
      return opacityscale[i][1] * (1 - d) + d * opacityscale[i - 1][1];
    }
  }

  return 1;
}

const genColormap = function (name = "jet", opacityscale = false) {
  let hasAlpha = false;
  const x = pack([
    colormap({
      colormap: name,
      nshades: N_COLORS,
      format: "rgba",
    }).map(function (c, i) {
      const a = opacityscale ? getOpacityFromScale(i / 255.0, opacityscale) : c[3];
      if (a < 1) hasAlpha = true;
      return [c[0], c[1], c[2], 255 * a];
    }),
  ]);

  return [hasAlpha, x];
};

export type SurfaceOptions = Record<string, any>;

/**
 * @see https://g.antv.antgroup.com/api/3d/geometry#cubegeometry
 */
export const Surface: SC<SurfaceOptions> = (options, context) => {
  // Render border only when colorAttribute is stroke.
  const { ...style } = options;
  const { coordinate } = context!;
  return (points: number[][], value, defaults) => {
    const { color: defaultColor } = defaults!;
    const { color = defaultColor, transform, opacity } = value;

    // Infer dims in raw points according to scale.
    const [width, height, depth] = (coordinate as unknown as Coordinate3D).getSize();
    const rh = Math.round(Math.abs(height / (points[1][1] - points[0][1]))) + 1;
    const rw = Math.round(Math.abs(width / (points[rh][0] - points[rh - 1][0]))) + 1;

    const field = ndarray(new Float32Array(rw * rh), [rw, rh]);
    field.data.set(points.map(([x, y, z]) => z));

    const _field = [
      ndarray(new Float32Array(1024), [0, 0]),
      ndarray(new Float32Array(1024), [0, 0]),
      ndarray(new Float32Array(1024), [0, 0]),
    ];

    const fsize = (field.shape[0] + 2) * (field.shape[1] + 2);

    // Resize if necessary
    if (fsize > _field[2].data.length) {
      _field[2].data = new Float32Array(nextPow2(fsize));
    }

    // Pad field
    _field[2] = ndarray(_field[2].data, [field.shape[0] + 2, field.shape[1] + 2]);
    padField(_field[2], field);

    // Save shape of field
    const shape = field.shape;

    // Resize coordinate fields if necessary
    for (let i = 0; i < 2; ++i) {
      if (_field[2].size > _field[i].data.length) {
        _field[i].data = new Float32Array(_field[2].size);
      }
      _field[i] = ndarray(_field[i].data, [shape[0] + 2, shape[1] + 2]);
    }

    for (let i = 0; i < 2; ++i) {
      const offset = [0, 0];
      offset[i] = 1;
      _field[i] = ndarray(_field[i].data, [shape[0] + 2, shape[1] + 2], offset, 0);
    }
    _field[0].set(0, 0, 0);
    for (let j = 0; j < shape[0]; ++j) {
      _field[0].set(j + 1, 0, j);
    }
    _field[0].set(shape[0] + 1, 0, shape[0] - 1);
    _field[1].set(0, 0, 0);
    for (let j = 0; j < shape[1]; ++j) {
      _field[1].set(0, j + 1, j);
    }
    _field[1].set(0, shape[1] + 1, shape[1] - 1);

    const fields = _field;

    // Compute surface normals
    const dfields = ndarray(new Float32Array(fields[2].size * 3 * 2), [3, shape[0] + 2, shape[1] + 2, 2]);
    for (let i = 0; i < 3; ++i) {
      gradient(dfields.pick(i), fields[i], "mirror");
    }
    const normals = ndarray(new Float32Array(fields[2].size * 3), [shape[0] + 2, shape[1] + 2, 3]);
    for (let i = 0; i < shape[0] + 2; ++i) {
      for (let j = 0; j < shape[1] + 2; ++j) {
        const dxdu = dfields.get(0, i, j, 0);
        const dxdv = dfields.get(0, i, j, 1);
        const dydu = dfields.get(1, i, j, 0);
        const dydv = dfields.get(1, i, j, 1);
        const dzdu = dfields.get(2, i, j, 0);
        const dzdv = dfields.get(2, i, j, 1);

        let nx = dydu * dzdv - dydv * dzdu;
        let ny = dzdu * dxdv - dzdv * dxdu;
        let nz = dxdu * dydv - dxdv * dydu;

        let nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (nl < 1e-8) {
          nl = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz));
          if (nl < 1e-8) {
            nz = 1.0;
            ny = nx = 0.0;
            nl = 1.0;
          } else {
            nl = 1.0 / nl;
          }
        } else {
          nl = 1.0 / Math.sqrt(nl);
        }

        normals.set(i, j, 0, nx * nl);
        normals.set(i, j, 1, ny * nl);
        normals.set(i, j, 2, nz * nl);
      }
    }
    // pool.free(dfields.data);

    const objectOffset = UNIFORMS.objectOffset;

    // Initialize surface
    const lo = [Infinity, Infinity, Infinity];
    const hi = [-Infinity, -Infinity, -Infinity];
    let lo_intensity = Infinity;
    let hi_intensity = -Infinity;
    const count = (shape[0] - 1) * (shape[1] - 1) * 6;
    const tverts = new Float32Array(nextPow2(10 * count));
    let tptr = 0;
    let vertexCount = 0;
    for (let i = 0; i < shape[0] - 1; ++i) {
      j_loop: for (let j = 0; j < shape[1] - 1; ++j) {
        // Test for NaNs
        for (let dx = 0; dx < 2; ++dx) {
          for (let dy = 0; dy < 2; ++dy) {
            for (let k = 0; k < 3; ++k) {
              const f = _field[k].get(1 + i + dx, 1 + j + dy);
              if (isNaN(f) || !isFinite(f)) {
                continue j_loop;
              }
            }
          }
        }
        for (let k = 0; k < 6; ++k) {
          const r = i + QUAD[k][0];
          const c = j + QUAD[k][1];

          const tx = _field[0].get(r + 1, c + 1);
          const ty = _field[1].get(r + 1, c + 1);
          const f = _field[2].get(r + 1, c + 1);

          let nx = normals.get(r + 1, c + 1, 0);
          let ny = normals.get(r + 1, c + 1, 1);
          let nz = normals.get(r + 1, c + 1, 2);

          // if (params.intensity) {
          //   vf = params.intensity.get(r, c)
          // }

          // var vf = (params.intensity) ?
          //   params.intensity.get(r, c) :
          //   f + objectOffset[2];

          const vf = f + objectOffset[2];

          tverts[tptr++] = r;
          tverts[tptr++] = c;
          tverts[tptr++] = tx;
          tverts[tptr++] = ty;
          tverts[tptr++] = f;
          tverts[tptr++] = 0;
          tverts[tptr++] = vf;
          tverts[tptr++] = nx;
          tverts[tptr++] = ny;
          tverts[tptr++] = nz;

          lo[0] = Math.min(lo[0], tx + objectOffset[0]);
          lo[1] = Math.min(lo[1], ty + objectOffset[1]);
          lo[2] = Math.min(lo[2], f + objectOffset[2]);
          lo_intensity = Math.min(lo_intensity, vf);

          hi[0] = Math.max(hi[0], tx + objectOffset[0]);
          hi[1] = Math.max(hi[1], ty + objectOffset[1]);
          hi[2] = Math.max(hi[2], f + objectOffset[2]);
          hi_intensity = Math.max(hi_intensity, vf);

          vertexCount += 1;
        }
      }
    }

    // if (params.intensityBounds) {
    //   lo_intensity = +params.intensityBounds[0]
    //   hi_intensity = +params.intensityBounds[1]
    // }

    // Scale all vertex intensities
    for (let i = 6; i < tptr; i += 10) {
      tverts[i] = (tverts[i] - lo_intensity) / (hi_intensity - lo_intensity);
    }

    const renderer = context!.canvas.getConfig().renderer;
    const plugin = renderer.getPlugin("device-renderer");
    const device = plugin.getDevice();

    const [hasAlpha, data] = genColormap();

    const colorMap = device.createTexture({
      format: Format.U8_RGBA,
      width: N_COLORS,
      height: 1,
      mipLevelCount: 1,
      dimension: TextureDimension.TEXTURE_2D,
      depthOrArrayLayers: 1,
      usage: TextureUsage.SAMPLED,
    });
    colorMap.setImageData([new Uint8Array([...data.data])]);

    const surfaceGeometry = new BufferGeometry(device);
    surfaceGeometry.setVertexBuffer({
      bufferIndex: VertexAttributeBufferIndex.POSITION,
      byteStride: SURFACE_VERTEX_SIZE,
      stepMode: VertexStepMode.VERTEX,
      attributes: [
        {
          format: Format.F32_RGBA,
          bufferByteOffset: 4 * 0,
          location: VertexAttributeLocation.POSITION,
        },
        {
          format: Format.F32_RGB,
          bufferByteOffset: 4 * 4,
          location: VertexAttributeLocation.POSITION + 1,
        },
        {
          format: Format.F32_RGB,
          bufferByteOffset: 4 * 7,
          location: VertexAttributeLocation.POSITION + 2,
        },
      ],
      data: new Uint8Array(tverts.subarray(0, tptr).buffer),
    });
    surfaceGeometry.vertexCount = vertexCount;

    const surfaceMaterial = new ShaderMaterial(device, {
      vertexShader: `
  layout(std140) uniform ub_SceneParams {
    mat4 u_ProjectionMatrix;
    mat4 u_ViewMatrix;
    vec3 u_CameraPosition;
    float u_DevicePixelRatio;
    vec2 u_Viewport;
    float u_IsOrtho;
  };

  layout(location = ${VertexAttributeLocation.MODEL_MATRIX0}) in vec4 a_ModelMatrix0;
  layout(location = ${VertexAttributeLocation.MODEL_MATRIX1}) in vec4 a_ModelMatrix1;
  layout(location = ${VertexAttributeLocation.MODEL_MATRIX2}) in vec4 a_ModelMatrix2;
  layout(location = ${VertexAttributeLocation.MODEL_MATRIX3}) in vec4 a_ModelMatrix3;
  layout(location = ${VertexAttributeLocation.POSITION}) in vec4 uv;
  layout(location = ${VertexAttributeLocation.POSITION + 1}) in vec3 f;
  layout(location = ${VertexAttributeLocation.POSITION + 2}) in vec3 normal;

  out float value;

  void main() {
    value = f.z;

    mat4 u_ModelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(uv.zw, f.x, 1.0);
  }
      `,
      fragmentShader: `
  uniform sampler2D u_Texture;

  in float value;
  out vec4 outputColor;
  void main() {
    vec4 surfaceColor = texture(SAMPLER_2D(u_Texture), vec2(value, value));
    outputColor = surfaceColor;
  }
      `,
    });

    surfaceMaterial.setUniforms({
      u_Texture: colorMap,
    });

    const surface = new Mesh({
      style: {
        x: 0,
        y: 0,
        z: 0,
        fill: "#1890FF",
        opacity: 1,
        visibility: "visible",
        geometry: surfaceGeometry,
        material: surfaceMaterial,
      },
    });
    surface.setOrigin(0, 0, 0);
    surface.scale(width / (rw - 1), height / (rh - 1), 1);
    // @ts-ignore
    return select(surface)
      .call(applyStyle, defaults)
      .style(toOpacityKey(options), opacity)
      .call(applyStyle, style)
      .node();
  };
};

Surface.props = {
  defaultMarker: "surface",
};
