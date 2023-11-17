import { threedlib } from "../../src";
import { Cartesian3D } from "../../src/coordinate/coordinate3D";
import { AxisZ } from "../../src/component/axisZ";
import { Point3D } from "../../src/mark/point3D";
import { Line3D } from "../../src/mark/line3D";
import { Interval3D } from "../../src/mark/interval3D";
import { Surface3D } from "../../src/mark/surface3D";

describe("threedlib", () => {
  it("threedlib should export expected marks", () => {
    expect(threedlib()).toEqual({
      "coordinate.cartesian3D": Cartesian3D,
      "component.axisZ": AxisZ,
      "mark.point3D": Point3D,
      "mark.line3D": Line3D,
      "mark.interval3D": Interval3D,
      "mark.surface3D": Surface3D,
    });
  });
});
