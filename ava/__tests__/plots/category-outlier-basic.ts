import { register } from "@antv/g2";
import { CategoryOutlier } from "../../src/insights";

/** @ts-ignore */
register("mark.categoryOutlier", CategoryOutlier);

export function CategoryOutlierBasic() {
  return {
    type: "view",
    children: [
      // 原始图表
      {
        data: { type: "fetch", value: "data/category-outlier.csv" },
        encode: {
          x: "year",
          y: "value",
        },
        type: "interval",
      },
      // 异常点 mark
      {
        type: "categoryOutlier",
        data: { type: "fetch", value: "data/category-outlier.csv" },
        encode: {
          x: "year",
          y: "value",
        },
      },
    ],
  };
}
