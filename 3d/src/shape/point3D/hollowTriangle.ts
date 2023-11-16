import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type HollowTriangleOptions = Record<string, any>;

/**
 * △
 */
export const HollowTriangle: SC<HollowTriangleOptions> = (options, context) => {
  return Color(
    {
      colorAttribute: "stroke",
      symbol: "triangle",
      ...options,
    },
    context,
  );
};

HollowTriangle.props = {
  defaultMarker: "hollowTriangle",
  ...Color.props,
};
