import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type TriangleDownOptions = Record<string, any>;

/**
 * ▼
 */
export const TriangleDown: SC<TriangleDownOptions> = (options, context) => {
  return Color(
    {
      colorAttribute: "fill",
      symbol: "triangle-down",
      ...options,
    },
    context,
  );
};

TriangleDown.props = {
  defaultMarker: "triangleDown",
  ...Color.props,
};
