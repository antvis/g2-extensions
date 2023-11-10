import { InsightExtractorProps } from "@antv/ava";
import { Insight, type InsightMarkOptions } from "./insight";

export type TrendMarkOptions = Omit<InsightMarkOptions, 'insightType' | 'options'> & {
  algorithmParameter?: Pick<InsightExtractorProps['options']['algorithmParameter'], 'trend'>
};

/** 趋势线拟合高阶 Mark 
 * trend regression line
*/
export const Trend = (options: TrendMarkOptions) => {
  const {algorithmParameter, ...restOptions} = options
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter
    },
    insightType: 'trend'
  })
}
