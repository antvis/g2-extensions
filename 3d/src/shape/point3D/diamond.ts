import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type DiamondOptions = Record<string, any>;

/**
 * ◆
 */
export const Diamond: SC<DiamondOptions> = (options, context) => {
  return Color({ colorAttribute: "fill", symbol: "diamond", ...options }, context);
};

Diamond.props = {
  defaultMarker: "diamond",
  ...Color.props,
};
