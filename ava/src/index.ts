import { Auto, type AutoOptions } from "./auto";
import { Insight, type InsightOptions } from "./insight";

export function autolib() {
  return {
    "mark.auto": Auto,
    "mark.insight": Insight
  };
}

export { Auto, AutoOptions, Insight, InsightOptions };
