import { InsightExtractorProps } from "@antv/ava";
import { Insight, InsightMarkOptions } from "./insight";

export type LowVarianceMarkOptions = Omit<InsightMarkOptions, 'insightType' | 'options'> & {
  algorithmParameter?: Pick<InsightExtractorProps['options']['algorithmParameter'], 'lowVariance'>
};

/** 低方差（均匀性）检测高阶 Mark 
 * low variance detection augmented mark
*/
export const LowVariance = (options: LowVarianceMarkOptions) => {
  const {algorithmParameter, ...restOptions} = options
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter
    },
    insightType: 'low_variance'
  })
}
