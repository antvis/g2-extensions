import { register } from "@antv/g2";
import { Trend } from "../../src/insights";

/** @ts-ignore */
register("mark.trend", Trend);

export function TrendBasic() {
  return {
    type: "view",
    children: [
      // 原始图表
      {
        data: { type: "fetch", value: "data/change-point.csv" },
        encode: {
          x: "year",
          y: "value",
        },
        type: "line",
      },
      // 趋势线 mark
      {
        type: "trend",
        data: { type: "fetch", value: "data/change-point.csv" },
        encode: {
          x: "year",
          y: "value",
        },
      },
    ],
  };
}
