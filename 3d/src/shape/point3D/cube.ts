import { MeshLambertMaterial, CubeGeometry, Mesh } from "@antv/g-plugin-3d";
import { ShapeComponent as SC, select } from "@antv/g2";
import { applyStyle, getOrigin, toOpacityKey } from "../utils";

const GEOMETRY_SIZE = 5;

export type CubeOptions = Record<string, any>;

/**
 * @see https://g.antv.antgroup.com/api/3d/geometry#cubegeometry
 */
export const Cube: SC<CubeOptions> = (options, context) => {
  // Render border only when colorAttribute is stroke.
  const { ...style } = options;

  // @ts-ignore
  if (!context.cubeGeometry) {
    const renderer = context.canvas.getConfig().renderer;
    const plugin = renderer.getPlugin("device-renderer");
    const device = plugin.getDevice();
    // create a sphere geometry
    // @ts-ignore
    context.cubeGeometry = new CubeGeometry(device, {
      width: GEOMETRY_SIZE * 2,
      height: GEOMETRY_SIZE * 2,
      depth: GEOMETRY_SIZE * 2,
    });
    // create a material with Phong lighting model
    // @ts-ignore
    context.cubeMaterial = new MeshLambertMaterial(device);
  }

  return (points, value, defaults) => {
    const { color: defaultColor } = defaults;
    const { color = defaultColor, transform, opacity } = value;
    const [cx, cy, cz] = getOrigin(points);
    const r = value.size;
    const finalRadius = r || style.r || defaults.r;

    const cube = new Mesh({
      style: {
        x: cx,
        y: cy,
        z: cz,
        // @ts-ignore
        geometry: context.cubeGeometry,
        // @ts-ignore
        material: context.cubeMaterial,
      },
    });
    cube.setOrigin(0, 0, 0);
    const scaling = finalRadius / GEOMETRY_SIZE;
    cube.scale(scaling);

    return select(cube)
      .call(applyStyle, defaults)
      .style("fill", color)
      .style("transform", transform)
      .style(toOpacityKey(options), opacity)
      .call(applyStyle, style)
      .node();
  };
};

Cube.props = {
  defaultMarker: "cube",
};
