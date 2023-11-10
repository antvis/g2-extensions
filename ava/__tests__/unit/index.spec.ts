import { expect, test } from "vitest";
import { Auto, Insight, autolib } from "../../src";
import { CategoryOutlier, ChangePoint, Correlation, LowVariance, TimeSeriesOutlier, Trend } from "../../src/insights";

test("g2-extension-ava should export expected marks", () => {
  expect(Auto).toBeDefined();
});

test("autolib should export expected marks", () => {
  expect(autolib()).toEqual({
    "mark.auto": Auto,
    "mark.insight": Insight,
    "mark.timeSeriesOutlier": TimeSeriesOutlier,
    "mark.trend": Trend,
    // "mark.correlation": Correlation,
    "mark.changePoint": ChangePoint,
    "mark.lowVariance": LowVariance,
    "mark.categoryOutlier": CategoryOutlier
  });
});
