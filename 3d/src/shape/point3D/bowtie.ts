import { ShapeComponent as SC } from "@antv/g2";
import { Color } from "./color";

export type BowtieOptions = Record<string, any>;

/**
 * ▶◀
 */
export const Bowtie: SC<BowtieOptions> = (options, context) => {
  return Color({ colorAttribute: "fill", symbol: "bowtie", ...options }, context);
};

Bowtie.props = {
  defaultMarker: "bowtie",
  ...Color.props,
};
