import { Interval3D } from "./mark/interval3D";
import { Point3D } from "./mark/point3D";
import { Line3D } from "./mark/line3D";
import { Surface3D } from "./mark/surface3D";
import { Cartesian3D } from "./coordinate/coordinate3D";
import { AxisZ } from "./component/axisZ";

export function threedlib() {
  return {
    "coordinate.cartesian3D": Cartesian3D,
    "component.axisZ": AxisZ,
    "mark.point3D": Point3D,
    "mark.line3D": Line3D,
    "mark.interval3D": Interval3D,
    "mark.surface3D": Surface3D,
  } as const;
}
