import { Auto } from "./auto";
import { CategoryOutlier, ChangePoint, Insight, LowVariance, TimeSeriesOutlier, Trend } from "./insights";

export function autolib() {
  return {
    "mark.auto": Auto,
    "mark.insight": Insight,
    "mark.timeSeriesOutlier": TimeSeriesOutlier,
    "mark.trend": Trend,
    // 相关性需要 ava 侧增加回归线后再导出
    // "mark.correlation": Correlation,
    "mark.changePoint": ChangePoint,
    "mark.lowVariance": LowVariance,
    "mark.categoryOutlier": CategoryOutlier,
  };
}

export * from "./auto";
export * from "./insights";
