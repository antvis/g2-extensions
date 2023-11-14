import { register } from "@antv/g2";
import { TimeSeriesOutlier } from "../../src/insights";

/** @ts-ignore */
register("mark.timeSeriesOutlier", TimeSeriesOutlier);

export function TimeSeriesOutlierBasic() {
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
        type: "line",
      },
      // 异常点 mark
      {
        type: "timeSeriesOutlier",
        data: { type: "fetch", value: "data/basic-time-series.csv" },
        encode: {
          "x": "year",
          "y": "life_expect"
        },
      },
    ]
  };
}
