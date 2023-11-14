import { register } from "@antv/g2";
import { ChangePoint } from "../../src/insights";

/** @ts-ignore */
register("mark.changePoint", ChangePoint);

export function ChangePointBasic() {
  return {
    type: 'view',
    children: [
        // 原始图表
        {
          data: { type: "fetch", value: "data/change-point.csv" },
          encode: {
              "x": "year",
              "y": "value"
          },
          type: "line",
          style: {
              "lineWidth": 2
          }
        },
        // 突变点 mark
        {
          type: "changePoint",
          data: { type: "fetch", value: "data/change-point.csv" },
          encode: {
            "x": "year",
            "y": "value"
          },
        },
      ]
  };
}
