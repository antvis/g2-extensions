import { register } from "@antv/g2";
import { Insight } from "../../src";

/** @ts-ignore 有类型定义问题，目前需要 Mark 中有 InsightMark 才行，后续 G2 层解决*/
register("mark.insight", Insight);

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
        style: {
            "lineWidth": 2
        }
      },
      // 洞察展示 mark
      {
        type: "insight",
        data: { type: "fetch", value: "data/basic-time-series.csv" },
        // 指定分析的维度、指标和分析类型
        measures: [
          { fieldName: 'life_expect', method: 'MEAN' },
        ],
        dimensions: ['year'],
        insightType: 'time_series_outlier',
      },
    ]
  };
}


