import { InsightExtractorProps } from "@antv/ava";
import { Insight, InsightMarkOptions } from "./insight";

export type TimeSeriesOutlierMarkOptions = Omit<InsightMarkOptions, "insightType" | "options"> & {
  algorithmParameter?: Pick<InsightExtractorProps["options"]["algorithmParameter"], "outlier">;
};

/** 时序数据异常检测高阶 Mark
 * time series anomaly detection augmented mark
 */
export const TimeSeriesOutlier = (options: TimeSeriesOutlierMarkOptions) => {
  const { algorithmParameter, ...restOptions } = options;
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter,
    },
    insightType: "time_series_outlier",
  });
};
