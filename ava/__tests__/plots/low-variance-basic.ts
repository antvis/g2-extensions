import { register } from "@antv/g2";
import { LowVariance } from "../../src/insights";

/** @ts-ignore */
register("mark.lowVariance", LowVariance);

export function LowVarianceBasic() {
  return {
    type: 'view',
    children: [
        // 原始图表
        {
          data: { type: "fetch", value: "data/basic-time-series.csv" },
          encode: {
              "x": "year",
              "y": "life_expect"
          },
          type: "interval",
          style: {
              "lineWidth": 2
          }
        },
        // 低方差 mark
        {
          type: "lowVariance",
          data: { type: "fetch", value: "data/basic-time-series.csv" },
          encode: {
            "x": "year",
            "y": "life_expect"
          },
        },
      ]
  };
}
