# g2-extension-3d

The [threed](https://github.com/antvis/G2/blob/v5/src/lib/std.ts) lib for G2.

## Getting Started

Create a renderer and register relative plugins which provides 3D rendering capabilities:

```ts
import { Renderer as WebGLRenderer } from '@antv/g-webgl';
import { Plugin as ThreeDPlugin } from '@antv/g-plugin-3d';
import { Plugin as ControlPlugin } from '@antv/g-plugin-control';

const renderer = new WebGLRenderer();
renderer.registerPlugin(new ThreeDPlugin());
renderer.registerPlugin(new ControlPlugin());
```

Then extend the runtime of G2 with 3D lib:

```ts
import { threedlib } from '@antv/g2-extension-3d';
import { Runtime, corelib, extend } from '@antv/g2';

const Chart = extend(Runtime, { ...corelib(), ...threedlib() });
const chart = new Chart({
  container: 'container',
  renderer,
  depth: 400,
});
```

Now we can use 3D marks like this:

```ts
chart
  .point3D()
  .data({});
```

## Scatter

[DEMO](https://g2.antv.antgroup.com/examples#threed-scatter)

## Line

[DEMO](https://g2.antv.antgroup.com/examples#threed-line)

## Bar

[DEMO](https://g2.antv.antgroup.com/examples#threed-bar)

