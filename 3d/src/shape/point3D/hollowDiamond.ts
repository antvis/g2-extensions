import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type HollowDiamondOptions = Record<string, any>;

/**
 * ◇
 */
export const HollowDiamond: SC<HollowDiamondOptions> = (options, context) => {
  return Color(
    {
      colorAttribute: "stroke",
      symbol: "diamond",
      ...options,
    },
    context,
  );
};

HollowDiamond.props = {
  defaultMarker: "hollowDiamond",
  ...Color.props,
};
