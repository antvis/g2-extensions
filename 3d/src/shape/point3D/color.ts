import { Coordinate, Vector2 } from "@antv/coord";
import { ShapeComponent as SC, select } from "@antv/g2";
import { Symbols } from "./utils";
import { applyStyle, getOrigin, toOpacityKey } from "../utils";

export type ColorOptions = {
  colorAttribute: "fill" | "stroke";
  symbol: string;
  mode?: "fixed" | "auto" | "normal";
  [key: string]: any;
};

function getRadius(mode: ColorOptions["mode"], points: Vector2[], value: Record<string, any>, coordinate: Coordinate) {
  if (points.length === 1) return undefined;
  const { size } = value;
  if (mode === "fixed") return size;
  if (mode === "normal") {
    const [[x0, y0], [x2, y2]] = points;
    const a = Math.abs((x2 - x0) / 2);
    const b = Math.abs((y2 - y0) / 2);
    return Math.max(0, (a + b) / 2);
  }
  return size;
}

/**
 * Render point in different coordinate.
 */
export const Color: SC<ColorOptions> = (options, context) => {
  // Render border only when colorAttribute is stroke.
  const { colorAttribute, symbol, mode = "auto", ...style } = options!;
  const path = (Symbols.get(symbol) || Symbols.get("point"))!;
  const { coordinate, document } = context!;
  return (points, value, defaults) => {
    const { lineWidth, color: defaultColor } = defaults!;
    const finalLineWidth = style.stroke ? lineWidth || 1 : lineWidth;
    const { color = defaultColor, transform, opacity } = value;
    const [cx, cy, cz] = getOrigin(points);
    const r = getRadius(mode, points, value, coordinate);
    const finalRadius = r || style.r || defaults!.r;
    const p = select(document.createElement("path", {}))
      .call(applyStyle, defaults)
      .style("fill", "transparent")
      .style("d", path(cx, cy, finalRadius))
      .style("isBillboard", true)
      .style("lineWidth", finalLineWidth)
      .style("transform", transform)
      .style("stroke", color)
      .style(toOpacityKey(options), opacity)
      .style(colorAttribute, color)
      .call(applyStyle, style)
      .node();

    p.translateLocal(0, 0, cz);

    return p;
  };
};

Color.props = {
  defaultEnterAnimation: "fadeIn",
  defaultUpdateAnimation: "morphing",
  defaultExitAnimation: "fadeOut",
};
