import { expect, test } from "vitest";
import { Cartesian3D, AxisZ, Point3D, Line3D, Interval3D, threedlib } from "../../src";

test("threedlib should export expected marks", () => {
  expect(threedlib()).toEqual({
    "coordinate.cartesian3D": Cartesian3D,
    "component.axisZ": AxisZ,
    "mark.point3D": Point3D,
    "mark.line3D": Line3D,
    "mark.interval3D": Interval3D,
  });
});
