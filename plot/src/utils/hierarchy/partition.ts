import * as d3Hierarchy from "@antv/vendor/d3-hierarchy";
import { assign, isArray, reduce, size, filter, isString } from '@antv/util';

const DEFAULT_OPTIONS: Options = {
  field: 'value',
  size: [1, 1], // width, height
  round: false,
  padding: 0,
  // Default desc.
  sort: (a, b) => b.value - a.value,
  as: ['x', 'y'],
  // Whether to ignore parentValue. When set to true, the weight of the parent node is determined by the child element.
  ignoreParentValue: true,
};

// In the same level, the nodes under the same parent node index order.
export const NODE_INDEX_FIELD = 'nodeIndex';
// Number of child nodes
export const CHILD_NODE_COUNT = 'childNodeCount';
// Ancestor of the node
export const NODE_ANCESTORS_FIELD = 'nodeAncestor';

const INVALID_FIELD_ERR_MSG = 'Invalid field: it must be a string!';

export function getField(
  options: {
    field?: string | string[];
    fields?: string | string[];
  },
  defaultField?: string,
): string {
  const { field, fields } = options;
  if (isString(field)) {
    return field;
  }
  if (isArray(field)) {
    console.warn(INVALID_FIELD_ERR_MSG);
    return field[0];
  }
  console.warn(`${INVALID_FIELD_ERR_MSG} will try to get fields instead.`);
  if (isString(fields)) {
    return fields;
  }
  if (isArray(fields) && fields.length) {
    return fields[0];
  }
  if (defaultField) {
    return defaultField;
  }
  throw new TypeError(INVALID_FIELD_ERR_MSG);
}

export function getAllNodes(root: any) {
  const nodes: any[] = [];
  if (root && root.each) {
    let parent;
    let index;
    // d3-hierarchy: Invokes the specified function for node and each descendant in **breadth-first order**
    root.each((node: any) => {
      if (node.parent !== parent) {
        parent = node.parent;
        index = 0;
      } else {
        index += 1;
      }
      const ancestors = filter(
        (node.ancestors?.() || []).map(
          (d: any) => nodes.find((n) => n.name === d.name) || d,
        ),
        ({ depth }) => depth > 0 && depth < node.depth,
      );

      node[NODE_ANCESTORS_FIELD] = ancestors;
      node[CHILD_NODE_COUNT] = node.children?.length || 0;
      node[NODE_INDEX_FIELD] = index;

      nodes.push(node);
    });
  } else if (root && root.eachNode) {
    // @antv/hierarchy
    root.eachNode((node: any) => {
      nodes.push(node);
    });
  }
  return nodes;
}

export interface Options {
  field: string;
  size?: [number, number];
  round?: boolean;
  ratio?: number;
  padding?: number;
  sort?: (a: any, b: any) => any; // Function;
  as?: [string, string];
  ignoreParentValue?: boolean;
}

export function partition(data: any, options: Options): any[] {
  options = assign({} as Options, DEFAULT_OPTIONS, options);
  const as = options.as;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError(
      'Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!',
    );
  }

  let field;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }

  const partition = (data) =>
    d3Hierarchy
      .partition()
      .size(options.size)
      .round(options.round)
      .padding(options.padding)(
      /**
       * The sum function must be specified in the d3Hierarchy layout to compute node values by calling the specified value function
       * from the current node in post-order traversal order for the current node and for each descendant node and returning the current node.
       * for example:
       * { node: 'parent', value: 10, children: [{node: 'child1', value: 5}, {node: 'child2', value: 5}, ]}.
       * The computed value obtained by the parent is sum(node(parent)) + sum(node(child1)) + sum(node(child2)).
       * In the sum function, d is the data passed in by the user and children is the reserved field.
       */
      d3Hierarchy
        .hierarchy(data)
        .sum((d) =>
          size(d.children)
            ? options.ignoreParentValue
              ? 0
              : d[field] - reduce(d.children, (a, b) => a + b[field], 0)
            : d[field],
        )
        .sort(options.sort),
    );
  const root = partition(data);

  /*
   * points:
   *   3  2
   *   0  1
   */
  const x = as[0];
  const y = as[1];

  root.each((node: any) => {
    node[x] = [node.x0, node.x1, node.x1, node.x0];
    node[y] = [node.y1, node.y1, node.y0, node.y0];
    node.name = node.name || node.data?.name || node.data?.label;
    node.data.name = node.name;

    ['x0', 'x1', 'y0', 'y1'].forEach((prop) => {
      if (as.indexOf(prop) === -1) {
        delete node[prop];
      }
    });
  });

  return getAllNodes(root);
}
