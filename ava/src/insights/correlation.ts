import type { InsightExtractorProps } from "@antv/ava";
import { Insight, type InsightMarkOptions } from "./insight";

export type CorrelationMarkOptions = Omit<InsightMarkOptions, "insightType" | "options"> & {
  algorithmParameter?: Pick<InsightExtractorProps["options"]["algorithmParameter"], "correlation">;
};

/** 相关性拟合线高阶 Mark
 * correlation regression line
 */
export const Correlation = (options: CorrelationMarkOptions) => {
  const { algorithmParameter, ...restOptions } = options;
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter,
    },
    insightType: "correlation",
  });
};
