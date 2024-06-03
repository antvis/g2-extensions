import { deepMix, pick, get } from "@antv/util";
import { partition, CHILD_NODE_COUNT } from "../utils/hierarchy/partition";

import type { CompositeMarkComponent as CC } from "./types";
import type { SunburstMark } from "../spec/mark";

export type SunburstData = {
  name: string;
  children: SunburstData[];
  [key: string]: any;
}[];

export type SunburstOptions = Omit<SunburstMark, "type">;

export const SUNBURST_TYPE = "sunburst";
export const SUNBURST_TYPE_FIELD = "markType";
export const SUNBURST_Y_FIELD = "value";
export const SUNBURST_PATH_FIELD = "path";
export const SUNBURST_ANCESTOR_FIELD = "ancestor-node";

/**
 * Sunburst TransformData
 * @param options
 */
export function transformData(options: Pick<SunburstOptions, "data" | "encode">) {
  const { data, encode } = options;
  const { color, value } = encode;

  const type = "partition";

  const nodes = partition(data, {
    field: value,
    // @ts-ignore
    type: `hierarchy.${type}`,
    as: ["x", "y"],
  });

  const result = [];

  nodes.forEach((node) => {
    if (node.depth === 0) {
      return null;
    }

    let path = node.data.name;
    const pathList = [path];
    let ancestorNode = { ...node };
    while (ancestorNode.depth > 1) {
      path = `${ancestorNode.parent.data?.name} / ${path}`;
      pathList.unshift(ancestorNode.parent.data?.name);
      ancestorNode = ancestorNode.parent;
    }

    const nodeInfo = {
      ...pick(node.data, [value]),
      [SUNBURST_PATH_FIELD]: path,
      [SUNBURST_ANCESTOR_FIELD]: ancestorNode.data.name,
      ...node,
    };

    if (color && color !== SUNBURST_ANCESTOR_FIELD) {
      nodeInfo[color] = node.data[color] || node.parent?.data?.[color];
    }

    result.push(nodeInfo);
  });

  return result.map((d) => {
    const x = d.x.slice(0, 2);
    const y = [d.y[2], d.y[0]];

    // 当出现 0 数值时，x 会出现相等的情况，导致渲染成的图形异常。
    if (x[0] === x[1]) {
      y[0] = y[1] = (d.y[2] + d.y[0]) / 2;
    }

    return {
      ...d,
      x,
      y,
      fillOpacity: 0.85 ** d.depth,
    };
  });
}

const DEFAULT_OPTIONS = {
  id: SUNBURST_TYPE,
  encode: {
    x: "x",
    y: "y",
    key: SUNBURST_PATH_FIELD,
    color: SUNBURST_ANCESTOR_FIELD,
    value: "value",
  },
  axis: { x: false, y: false },
  style: {
    [SUNBURST_TYPE_FIELD]: SUNBURST_TYPE,
    stroke: "#fff",
    lineWidth: 0.5,
    fillOpacity: "fillOpacity",
    [CHILD_NODE_COUNT]: CHILD_NODE_COUNT,
    depth: "depth",
  },
  state: {
    active: { zIndex: 2, stroke: "#000" },
    inactive: { zIndex: 1, stroke: "#fff" },
  },
  legend: false,
  interaction: { drillDown: true },
  coordinate: {
    type: "polar",
    innerRadius: 0.2,
  },
};

export const Sunburst: CC<SunburstOptions> = (options) => {
  const { encode: encodeOption, data = [], legend, ...resOptions } = options;

  const coordinate = {
    ...resOptions.coordinate,
    // Reac Bug InnerRadius = 0.
    innerRadius: Math.max(get(resOptions, ["coordinate", "innerRadius"], 0.2), 0.00001),
  };

  const encode = { ...DEFAULT_OPTIONS.encode, ...encodeOption };
  const { value } = encode;
  const rectData = transformData({ encode, data });

  return [
    deepMix({}, DEFAULT_OPTIONS, {
      type: "rect",
      data: rectData,
      encode,
      tooltip: {
        title: "path",
        items: [
          (d) => {
            return {
              name: value,
              value: d[value],
            };
          },
        ],
      },
      ...resOptions,
      coordinate,
    }),
  ];
};

Sunburst.props = {};
