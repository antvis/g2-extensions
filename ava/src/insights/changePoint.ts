import type { InsightExtractorProps } from "@antv/ava";
import { Insight, type InsightMarkOptions } from "./insight";

export type ChangePointMarkOptions = Omit<InsightMarkOptions, "insightType" | "options"> & {
  algorithmParameter?: Pick<InsightExtractorProps["options"]["algorithmParameter"], "changePoint">;
};

/** 突变点检测高阶 Mark
 * change point detection augmented mark
 */
export const ChangePoint = (options: ChangePointMarkOptions) => {
  const { algorithmParameter, ...restOptions } = options;
  return Insight({
    ...restOptions,
    options: {
      algorithmParameter,
    },
    insightType: "change_point",
  });
};
