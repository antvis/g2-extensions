import { Coordinate3D } from "@antv/coord";
import { MarkComponent as MC, BaseMark, Vector3, MaybeZeroX, MaybeZeroY, MaybeZeroZ, MaybeSize } from "@antv/g2";
import { Surface } from "../shape/surface3D/surface";
import { baseGeometryChannels, basePostInference, basePreInference, tooltip3d } from "./utils";

// @ts-ignore
type Surface3DMark = BaseMark<"surface">;

export type Surface3DOptions = Omit<Surface3DMark, "type">;

export const Surface3D: MC<Surface3DOptions> = (options) => {
  return (index, _, value, coordinate) => {
    const { x: X, y: Y, z: Z } = value;
    // const [width, height, depth] = (
    //   coordinate as unknown as Coordinate3D
    // ).getSize();
    const xyz: (i: number) => Vector3 = (i) => {
      const x = +X[i] || 0;
      const y = +Y[i] || 0;
      const z = +Z[i || 0];
      return [x, y, z];
    };
    const P = Array.from(index, (i) => {
      const [cx, cy, cz] = xyz(i);
      return [...(coordinate as unknown as Coordinate3D).map([cx, cy, cz])] as Vector3;
    });
    return [[0], [P]];
  };
};

const shape = {
  surface: Surface,
};

Surface3D.props = {
  defaultShape: "surface",
  defaultLabelShape: "label",
  composite: false,
  shape,
  channels: [
    ...baseGeometryChannels({ shapes: Object.keys(shape) }),
    { name: "x", required: true },
    { name: "y", required: true },
    { name: "z", required: true },
    // { name: 'color', scale: 'identity', required: true },
  ],
  // @ts-ignore
  preInference: [...basePreInference(), { type: MaybeZeroX }, { type: MaybeZeroY }, { type: MaybeZeroZ }],
  // @ts-ignore
  postInference: [...basePostInference(), { type: MaybeSize }, ...tooltip3d()],
  interaction: {
    shareTooltip: false,
    seriesTooltip: false,
    crosshairs: false,
  },
};
