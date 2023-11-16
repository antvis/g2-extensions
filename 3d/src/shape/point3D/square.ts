import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type SquareOptions = Record<string, any>;

/**
 * ■
 */
export const Square: SC<SquareOptions> = (options, context) => {
  return Color({ colorAttribute: "fill", symbol: "square", ...options }, context);
};

Square.props = {
  defaultMarker: "square",
  ...Color.props,
};
