import { InsightExtractorProps } from "@antv/ava";
import { Insight, type InsightMarkOptions } from "./insight";

export type CategoryOutlierMarkOptions = Omit<InsightMarkOptions, 'insightType' | 'options'> & {
  algorithmParameter?: Pick<InsightExtractorProps['options']['algorithmParameter'], 'outlier'>
};;

/** 类别型数据异常检测高阶 Mark 
 * category outlier detection augmented mark
*/
export const CategoryOutlier = (options: CategoryOutlierMarkOptions) => {
  const {algorithmParameter, ...restOptions} = options
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter
    },
    insightType: 'category_outlier'
  })
}
