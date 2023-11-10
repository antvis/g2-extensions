import { generateInsightVisualizationSpec, insightPatternsExtractor } from "@antv/ava";
import { map } from "@antv/util";
import type { Dimension, InsightExtractorProps, Measure } from "@antv/ava";

/** 目前可支持的能产生 insight annotations 的 marks */
export const INSIGHT_TYPES: InsightExtractorProps['insightType'][] = ["category_outlier", "trend", "change_point", "time_series_outlier", "low_variance", "correlation"]

export type InsightMarkOptions = InsightExtractorProps & {
  insightType: typeof INSIGHT_TYPES[number];
  encode?: {
    /** 兼容 x, y 类型传参，默认 x 轴为维度，y 轴为指标 */
    x?: string;
    y?: string;
  };
  // TODO 支持指定 style 等其他 mark 属性
};

export const Insight = (options: InsightMarkOptions) => {
  if(!options) return {}
  const { data, encode, insightType, options: insightExtractorOptions } = options;
  const { x, y } = encode || {}
  const isMultiMeasure = insightType === 'correlation'
  const defaultDimensions: Dimension[] = isMultiMeasure ? []: [{fieldName: x}]
  const defaultMeasures: Measure[] = isMultiMeasure? [{fieldName: x, method: 'SUM'}, {fieldName: y, method: 'SUM'}] : [{fieldName: y, method: 'SUM'}]
  const {dimensions = defaultDimensions, measures = defaultMeasures} = options
  // try catch 下，防止 ava insight 内部报错导致图表绘制不出来
  try {
    const patterns = insightPatternsExtractor({
      data,
      dimensions,
      measures,
      options: insightExtractorOptions,
      insightType,
    })
    // TODO 可改成直接使用 insight 模块的绘制 mark 函数
    const specs = map(generateInsightVisualizationSpec({
      dimensions,
      measures,
      subspace: [],
      patterns,
      data
    }), result => result.chartSpec)
    /** @ts-ignore 可以获得 children */
    return specs?.[0]?.children;
  } catch (err) {
    console.error(err);
    return []
  }
};
