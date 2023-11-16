import { Coordinate3D } from "@antv/coord";
import { PointMark, MarkComponent as MC, Vector3, MaybeZeroX, MaybeZeroY, MaybeZeroZ, MaybeSize } from "@antv/g2";
import { baseGeometryChannels, basePostInference, basePreInference, tooltip3d } from "./utils";
import { Cube } from "../shape/point3D/cube";
import { Sphere } from "../shape/point3D/sphere";
import { Point } from "../shape/point3D/point";
import { Cross } from "../shape/point3D/cross";
import { Triangle } from "../shape/point3D/triangle";
import { TriangleDown } from "../shape/point3D/triangleDown";
import { HollowPoint } from "../shape/point3D/hollow";
import { HollowDiamond } from "../shape/point3D/hollowDiamond";
import { HollowHexagon } from "../shape/point3D/hollowHexagon";
import { HollowSquare } from "../shape/point3D/hollowSquare";
import { HollowTriangleDown } from "../shape/point3D/hollowTriangleDown";
import { HollowTriangle } from "../shape/point3D/hollowTriangle";
import { HollowBowtie } from "../shape/point3D/hollowBowtie";
import { Plus } from "../shape/point3D/plus";
import { Diamond } from "../shape/point3D/diamond";
import { Square } from "../shape/point3D/square";
import { Hexagon } from "../shape/point3D/hexagon";
import { Bowtie } from "../shape/point3D/bowtie";
import { Hyphen } from "../shape/point3D/hyphen";
import { Tick } from "../shape/point3D/tick";
import { Line } from "../shape/point3D/line";

export type PointOptions = Omit<PointMark, "type">;

/**
 * Convert value for each channel to point shapes.
 * Calc the bbox of each point based on x, y and r.
 * This is for allowing their radius can be affected by coordinate(e.g. fisheye).
 */
export const Point3D: MC<PointOptions> = (options) => {
  return (index, _, value, coordinate) => {
    const { x: X, y: Y, z: Z, size: S, dx: DX, dy: DY, dz: DZ } = value;
    const [width, height, depth] = (coordinate as unknown as Coordinate3D).getSize();
    const xyz: (i: number) => Vector3 = (i) => {
      const dx = +(DX?.[i] || 0);
      const dy = +(DY?.[i] || 0);
      const dz = +(DZ?.[i] || 0);
      const x = +X[i];
      const y = +Y[i];
      const z = +Z[i];
      const cx = x + dx;
      const cy = y + dy;
      const cz = z + dz;
      return [cx, cy, cz];
    };
    const P = S
      ? Array.from(index, (i) => {
          const [cx, cy, cz] = xyz(i);
          const r = +S[i];
          const a = r / width;
          const b = r / height;
          const c = r / depth;
          const p1: Vector3 = [cx - a, cy - b, cz - c];
          const p2: Vector3 = [cx + a, cy + b, cz + c];
          return [
            (coordinate as unknown as Coordinate3D).map([...p1, cz]),
            (coordinate as unknown as Coordinate3D).map([...p2, cz]),
          ] as Vector3[];
        })
      : Array.from(index, (i) => {
          const [cx, cy, cz] = xyz(i);
          return [(coordinate as unknown as Coordinate3D).map([cx, cy, cz])] as Vector3[];
        });
    return [index, P];
  };
};

const shape = {
  sphere: Sphere,
  cube: Cube,
  hollow: HollowPoint,
  hollowDiamond: HollowDiamond,
  hollowHexagon: HollowHexagon,
  hollowSquare: HollowSquare,
  hollowTriangleDown: HollowTriangleDown,
  hollowTriangle: HollowTriangle,
  hollowBowtie: HollowBowtie,
  point: Point,
  plus: Plus,
  diamond: Diamond,
  square: Square,
  triangle: Triangle,
  hexagon: Hexagon,
  cross: Cross,
  bowtie: Bowtie,
  hyphen: Hyphen,
  line: Line,
  tick: Tick,
  triangleDown: TriangleDown,
};

Point3D.props = {
  defaultShape: "cube",
  defaultLabelShape: "label",
  composite: false,
  shape,
  channels: [
    ...baseGeometryChannels({ shapes: Object.keys(shape) }),
    { name: "x", required: true },
    { name: "y", required: true },
    { name: "z", required: true },
    { name: "series", scale: "band" },
    { name: "size", quantitative: "sqrt" },
    { name: "dx", scale: "identity" },
    { name: "dy", scale: "identity" },
    { name: "dz", scale: "identity" },
  ],
  // @ts-ignore
  preInference: [...basePreInference(), { type: MaybeZeroX }, { type: MaybeZeroY }, { type: MaybeZeroZ }],
  // @ts-ignore
  postInference: [...basePostInference(), { type: MaybeSize }, ...tooltip3d()],
};
