import { Primitive } from "@antv/vendor/d3-array";
import { Selection, Vector2, Vector3 } from "@antv/g2";

export function applyStyle(selection: Selection, style: Record<string, Primitive>) {
  for (const [key, value] of Object.entries(style)) {
    selection.style(key, value);
  }
}

export function toOpacityKey(options) {
  const { colorAttribute, opacityAttribute = colorAttribute } = options;
  return `${opacityAttribute}Opacity`;
}

export function getOrigin(points: (Vector2 | Vector3)[]) {
  if (points.length === 1) return points[0];
  const [[x0, y0, z0 = 0], [x2, y2, z2 = 0]] = points;
  return [(x0 + x2) / 2, (y0 + y2) / 2, (z0 + z2) / 2];
}

export function nextPow2(v: number) {
  // @ts-ignore
  v += v === 0;
  --v;
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  return v + 1;
}
