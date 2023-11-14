// import {
//   ShaderMaterial,
//   BufferGeometry,
//   Mesh,
//   VertexAttributeBufferIndex,
//   VertexAttributeLocation,
//   VertexStepMode,
//   Format,
//   TextureDimension,
//   TextureUsage,
// } from "@antv/g-plugin-3d";
// import { Coordinate3D } from "@antv/coord";
// import { ShapeComponent as SC, select } from "@antv/g2";
// import { applyStyle, toOpacityKey } from "../utils";
// import ndarray from "ndarray";
// import fill from "ndarray-fill";
// import pool from "typedarray-pool";
// import bits from "bit-twiddle";
// import ops from "ndarray-ops";
// import pack from "ndarray-pack";
// import gradient from "ndarray-gradient";
// import colormap from "colormap";

// const SURFACE_VERTEX_SIZE = 4 * (4 + 3 + 3);
// const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
// const QUAD = [
//   [0, 0],
//   [0, 1],
//   [1, 0],
//   [1, 1],
//   [1, 0],
//   [0, 1],
// ];
// const PERMUTATIONS = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

// (function () {
//   for (var i = 0; i < 3; ++i) {
//     var p = PERMUTATIONS[i];
//     var u = (i + 1) % 3;
//     var v = (i + 2) % 3;
//     p[u + 0] = 1;
//     p[v + 3] = 1;
//     p[i + 6] = 1;
//   }
// })();

// const UNIFORMS = {
//   model: IDENTITY,
//   view: IDENTITY,
//   projection: IDENTITY,
//   inverseModel: IDENTITY.slice(),
//   lowerBound: [0, 0, 0],
//   upperBound: [0, 0, 0],
//   colorMap: 0,
//   clipBounds: [
//     [0, 0, 0],
//     [0, 0, 0],
//   ],
//   height: 0.0,
//   contourTint: 0,
//   contourColor: [0, 0, 0, 1],
//   permutation: [1, 0, 0, 0, 1, 0, 0, 0, 1],
//   zOffset: -1e-4,
//   objectOffset: [0, 0, 10],
//   kambient: 1,
//   kdiffuse: 1,
//   kspecular: 1,
//   lightPosition: [1000, 1000, 1000],
//   eyePosition: [0, 0, 0],
//   roughness: 1,
//   fresnel: 1,
//   opacity: 1,
//   vertexColor: 0,
// };

// const N_COLORS = 256;
// const padField = function (dstField, srcField) {
//   var srcShape = srcField.shape.slice();
//   var dstShape = dstField.shape.slice();

//   // Center
//   ops.assign(dstField.lo(1, 1).hi(srcShape[0], srcShape[1]), srcField);

//   // Edges
//   ops.assign(dstField.lo(1).hi(srcShape[0], 1), srcField.hi(srcShape[0], 1));
//   ops.assign(dstField.lo(1, dstShape[1] - 1).hi(srcShape[0], 1), srcField.lo(0, srcShape[1] - 1).hi(srcShape[0], 1));
//   ops.assign(dstField.lo(0, 1).hi(1, srcShape[1]), srcField.hi(1));
//   ops.assign(dstField.lo(dstShape[0] - 1, 1).hi(1, srcShape[1]), srcField.lo(srcShape[0] - 1));
//   // Corners
//   dstField.set(0, 0, srcField.get(0, 0));
//   dstField.set(0, dstShape[1] - 1, srcField.get(0, srcShape[1] - 1));
//   dstField.set(dstShape[0] - 1, 0, srcField.get(srcShape[0] - 1, 0));
//   dstField.set(dstShape[0] - 1, dstShape[1] - 1, srcField.get(srcShape[0] - 1, srcShape[1] - 1));
// };

// function getOpacityFromScale(ratio, opacityscale) {
//   // copied form gl-mesh3d
//   if (!opacityscale) return 1;
//   if (!opacityscale.length) return 1;

//   for (var i = 0; i < opacityscale.length; ++i) {
//     if (opacityscale.length < 2) return 1;
//     if (opacityscale[i][0] === ratio) return opacityscale[i][1];
//     if (opacityscale[i][0] > ratio && i > 0) {
//       var d = (opacityscale[i][0] - ratio) / (opacityscale[i][0] - opacityscale[i - 1][0]);
//       return opacityscale[i][1] * (1 - d) + d * opacityscale[i - 1][1];
//     }
//   }

//   return 1;
// }

// const genColormap = function (name = "jet", opacityscale = false) {
//   var hasAlpha = false;
//   var x = pack([
//     colormap({
//       colormap: name,
//       nshades: N_COLORS,
//       format: "rgba",
//     }).map(function (c, i) {
//       var a = opacityscale ? getOpacityFromScale(i / 255.0, opacityscale) : c[3];
//       if (a < 1) hasAlpha = true;
//       return [c[0], c[1], c[2], 255 * a];
//     }),
//   ]);

//   return [hasAlpha, x];
// };

// export type SurfaceOptions = Record<string, any>;

// /**
//  * @see https://g.antv.antgroup.com/api/3d/geometry#cubegeometry
//  */
// export const Surface: SC<SurfaceOptions> = (options, context) => {
//   // Render border only when colorAttribute is stroke.
//   const { ...style } = options;
//   const { coordinate } = context;
//   return (points: number[][], value, defaults) => {
//     const { color: defaultColor } = defaults;
//     const { color = defaultColor, transform, opacity } = value;

//     const [width, height, depth] = (coordinate as unknown as Coordinate3D).getSize();

//     console.log(width, height, depth, points);

//     const hwidth = Math.ceil(width / 2);
//     const hheight = Math.ceil(height / 2);
//     var field = ndarray(new Float32Array(4 * (hwidth + 1) * (hheight + 1)), [2 * (hwidth + 1), 2 * (hheight + 1)]);

//     fill(field, function (x, y) {
//       return 0;
//     });

//     points.forEach(([x, y, z]) => {
//       const index = Math.floor(x) * hwidth * 2 + Math.floor(y);
//       field.data[index] = z;
//     });

//     const _field = [
//       ndarray(pool.mallocFloat(1024), [0, 0]),
//       ndarray(pool.mallocFloat(1024), [0, 0]),
//       ndarray(pool.mallocFloat(1024), [0, 0]),
//     ];

//     var fsize = (field.shape[0] + 2) * (field.shape[1] + 2);

//     // Resize if necessary
//     if (fsize > _field[2].data.length) {
//       pool.freeFloat(_field[2].data);
//       _field[2].data = pool.mallocFloat(bits.nextPow2(fsize));
//     }

//     // Pad field
//     _field[2] = ndarray(_field[2].data, [field.shape[0] + 2, field.shape[1] + 2]);
//     padField(_field[2], field);

//     // Save shape of field
//     const shape = field.shape.slice();

//     console.log("shape", shape);

//     // Resize coordinate fields if necessary
//     for (var i = 0; i < 2; ++i) {
//       if (_field[2].size > _field[i].data.length) {
//         pool.freeFloat(_field[i].data);
//         _field[i].data = pool.mallocFloat(_field[2].size);
//       }
//       _field[i] = ndarray(_field[i].data, [shape[0] + 2, shape[1] + 2]);
//     }

//     for (i = 0; i < 2; ++i) {
//       var offset = [0, 0];
//       offset[i] = 1;
//       _field[i] = ndarray(_field[i].data, [shape[0] + 2, shape[1] + 2], offset, 0);
//     }
//     _field[0].set(0, 0, 0);
//     for (var j = 0; j < shape[0]; ++j) {
//       _field[0].set(j + 1, 0, j);
//     }
//     _field[0].set(shape[0] + 1, 0, shape[0] - 1);
//     _field[1].set(0, 0, 0);
//     for (j = 0; j < shape[1]; ++j) {
//       _field[1].set(0, j + 1, j);
//     }
//     _field[1].set(0, shape[1] + 1, shape[1] - 1);

//     // Save shape
//     var fields = _field;

//     // Compute surface normals
//     var dfields = ndarray(pool.mallocFloat(fields[2].size * 3 * 2), [3, shape[0] + 2, shape[1] + 2, 2]);
//     for (i = 0; i < 3; ++i) {
//       gradient(dfields.pick(i), fields[i], "mirror");
//     }
//     var normals = ndarray(pool.mallocFloat(fields[2].size * 3), [shape[0] + 2, shape[1] + 2, 3]);
//     for (i = 0; i < shape[0] + 2; ++i) {
//       for (j = 0; j < shape[1] + 2; ++j) {
//         var dxdu = dfields.get(0, i, j, 0);
//         var dxdv = dfields.get(0, i, j, 1);
//         var dydu = dfields.get(1, i, j, 0);
//         var dydv = dfields.get(1, i, j, 1);
//         var dzdu = dfields.get(2, i, j, 0);
//         var dzdv = dfields.get(2, i, j, 1);

//         var nx = dydu * dzdv - dydv * dzdu;
//         var ny = dzdu * dxdv - dzdv * dxdu;
//         var nz = dxdu * dydv - dxdv * dydu;

//         var nl = Math.sqrt(nx * nx + ny * ny + nz * nz);
//         if (nl < 1e-8) {
//           nl = Math.max(Math.abs(nx), Math.abs(ny), Math.abs(nz));
//           if (nl < 1e-8) {
//             nz = 1.0;
//             ny = nx = 0.0;
//             nl = 1.0;
//           } else {
//             nl = 1.0 / nl;
//           }
//         } else {
//           nl = 1.0 / Math.sqrt(nl);
//         }

//         normals.set(i, j, 0, nx * nl);
//         normals.set(i, j, 1, ny * nl);
//         normals.set(i, j, 2, nz * nl);
//       }
//     }
//     pool.free(dfields.data);

//     const objectOffset = UNIFORMS.objectOffset;

//     // Initialize surface
//     var lo = [Infinity, Infinity, Infinity];
//     var hi = [-Infinity, -Infinity, -Infinity];
//     var lo_intensity = Infinity;
//     var hi_intensity = -Infinity;
//     var count = (shape[0] - 1) * (shape[1] - 1) * 6;
//     var tverts = pool.mallocFloat(bits.nextPow2(10 * count));
//     var tptr = 0;
//     var vertexCount = 0;
//     for (i = 0; i < shape[0] - 1; ++i) {
//       j_loop: for (j = 0; j < shape[1] - 1; ++j) {
//         // Test for NaNs
//         for (var dx = 0; dx < 2; ++dx) {
//           for (var dy = 0; dy < 2; ++dy) {
//             for (var k = 0; k < 3; ++k) {
//               var f = _field[k].get(1 + i + dx, 1 + j + dy);
//               if (isNaN(f) || !isFinite(f)) {
//                 continue j_loop;
//               }
//             }
//           }
//         }
//         for (k = 0; k < 6; ++k) {
//           var r = i + QUAD[k][0];
//           var c = j + QUAD[k][1];

//           var tx = _field[0].get(r + 1, c + 1);
//           var ty = _field[1].get(r + 1, c + 1);
//           f = _field[2].get(r + 1, c + 1);

//           nx = normals.get(r + 1, c + 1, 0);
//           ny = normals.get(r + 1, c + 1, 1);
//           nz = normals.get(r + 1, c + 1, 2);

//           // if (params.intensity) {
//           //   vf = params.intensity.get(r, c)
//           // }

//           // var vf = (params.intensity) ?
//           //   params.intensity.get(r, c) :
//           //   f + objectOffset[2];

//           var vf = f + objectOffset[2];

//           tverts[tptr++] = r;
//           tverts[tptr++] = c;
//           tverts[tptr++] = tx;
//           tverts[tptr++] = ty;
//           tverts[tptr++] = f;
//           tverts[tptr++] = 0;
//           tverts[tptr++] = vf;
//           tverts[tptr++] = nx;
//           tverts[tptr++] = ny;
//           tverts[tptr++] = nz;

//           lo[0] = Math.min(lo[0], tx + objectOffset[0]);
//           lo[1] = Math.min(lo[1], ty + objectOffset[1]);
//           lo[2] = Math.min(lo[2], f + objectOffset[2]);
//           lo_intensity = Math.min(lo_intensity, vf);

//           hi[0] = Math.max(hi[0], tx + objectOffset[0]);
//           hi[1] = Math.max(hi[1], ty + objectOffset[1]);
//           hi[2] = Math.max(hi[2], f + objectOffset[2]);
//           hi_intensity = Math.max(hi_intensity, vf);

//           vertexCount += 1;
//         }
//       }
//     }

//     // if (params.intensityBounds) {
//     //   lo_intensity = +params.intensityBounds[0]
//     //   hi_intensity = +params.intensityBounds[1]
//     // }

//     // Scale all vertex intensities
//     for (i = 6; i < tptr; i += 10) {
//       tverts[i] = (tverts[i] - lo_intensity) / (hi_intensity - lo_intensity);
//     }

//     const renderer = context.canvas.getConfig().renderer;
//     const plugin = renderer.getPlugin("device-renderer");
//     const device = plugin.getDevice();

//     const [hasAlpha, data] = genColormap();
//     const colorMap = device.createTexture({
//       format: Format.U8_RGBA,
//       width: N_COLORS,
//       height: 1,
//       mipLevelCount: 1,
//       dimension: TextureDimension.TEXTURE_2D,
//       depthOrArrayLayers: 1,
//       usage: TextureUsage.SAMPLED,
//     });
//     colorMap.setImageData([new Uint8Array([...data.data])]);

//     const surfaceGeometry = new BufferGeometry(device);
//     surfaceGeometry.setVertexBuffer({
//       bufferIndex: VertexAttributeBufferIndex.POSITION,
//       byteStride: SURFACE_VERTEX_SIZE,
//       stepMode: VertexStepMode.VERTEX,
//       attributes: [
//         {
//           format: Format.F32_RGBA,
//           bufferByteOffset: 4 * 0,
//           location: VertexAttributeLocation.POSITION,
//         },
//         {
//           format: Format.F32_RGB,
//           bufferByteOffset: 4 * 4,
//           location: VertexAttributeLocation.POSITION + 1,
//         },
//         {
//           format: Format.F32_RGB,
//           bufferByteOffset: 4 * 7,
//           location: VertexAttributeLocation.POSITION + 2,
//         },
//       ],
//       data: new Uint8Array(tverts.subarray(0, tptr).buffer),
//     });
//     surfaceGeometry.vertexCount = vertexCount;

//     const surfaceMaterial = new ShaderMaterial(device, {
//       vertexShader: `
//   layout(std140) uniform ub_SceneParams {
//     mat4 u_ProjectionMatrix;
//     mat4 u_ViewMatrix;
//     vec3 u_CameraPosition;
//     float u_DevicePixelRatio;
//     vec2 u_Viewport;
//     float u_IsOrtho;
//   };

//   layout(location = ${VertexAttributeLocation.MODEL_MATRIX0}) in vec4 a_ModelMatrix0;
//   layout(location = ${VertexAttributeLocation.MODEL_MATRIX1}) in vec4 a_ModelMatrix1;
//   layout(location = ${VertexAttributeLocation.MODEL_MATRIX2}) in vec4 a_ModelMatrix2;
//   layout(location = ${VertexAttributeLocation.MODEL_MATRIX3}) in vec4 a_ModelMatrix3;
//   layout(location = ${VertexAttributeLocation.POSITION}) in vec4 uv;
//   layout(location = ${VertexAttributeLocation.POSITION + 1}) in vec3 f;
//   layout(location = ${VertexAttributeLocation.POSITION + 2}) in vec3 normal;

//   out float value;

//   void main() {
//     value = f.z;

//     mat4 u_ModelMatrix = mat4(a_ModelMatrix0, a_ModelMatrix1, a_ModelMatrix2, a_ModelMatrix3);
//     gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * vec4(uv.zw, f.x, 1.0);
//   }
//       `,
//       fragmentShader: `
//   uniform sampler2D u_Texture;

//   in float value;
//   out vec4 outputColor;
//   void main() {
//     vec4 surfaceColor = texture(SAMPLER_2D(u_Texture), vec2(value, value));
//     outputColor = surfaceColor;
//   }
//       `,
//     });

//     surfaceMaterial.setUniforms({
//       u_Texture: colorMap,
//     });

//     const surface = new Mesh({
//       style: {
//         x: 0,
//         y: 0,
//         z: 0,
//         fill: "#1890FF",
//         opacity: 1,
//         geometry: surfaceGeometry,
//         material: surfaceMaterial,
//       },
//     });

//     return select(surface)
//       .call(applyStyle, defaults)
//       .style(toOpacityKey(options), opacity)
//       .call(applyStyle, style)
//       .node();
//   };
// };

// Surface.props = {
//   defaultMarker: "surface",
// };
