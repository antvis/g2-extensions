import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type PlusOptions = Record<string, any>;

/**
 * +
 */
export const Plus: SC<PlusOptions> = (options, context) => {
  return Color({ colorAttribute: "stroke", symbol: "plus", ...options }, context);
};

Plus.props = {
  defaultMarker: "plus",
  ...Color.props,
};
