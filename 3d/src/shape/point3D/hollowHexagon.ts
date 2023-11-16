import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type HollowHexagonOptions = Record<string, any>;

/**
 * ⬡
 */
export const HollowHexagon: SC<HollowHexagonOptions> = (options, context) => {
  return Color(
    {
      colorAttribute: "stroke",
      symbol: "hexagon",
      ...options,
    },
    context,
  );
};

HollowHexagon.props = {
  defaultMarker: "hollowHexagon",
  ...Color.props,
};
