import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type HexagonOptions = Record<string, any>;

/**
 * ⭓
 */
export const Hexagon: SC<HexagonOptions> = (options, context) => {
  return Color({ colorAttribute: "fill", symbol: "hexagon", ...options }, context);
};

Hexagon.props = {
  defaultMarker: "hexagon",
  ...Color.props,
};
