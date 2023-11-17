# g2-extension-3d

The [threed](https://github.com/antvis/G2/blob/v5/src/lib/std.ts) lib for G2.

## Getting Started

Create a renderer and register relative plugins which provides 3D rendering capabilities:

```ts
import { Renderer as WebGLRenderer } from "@antv/g-webgl";
import { Plugin as ThreeDPlugin } from "@antv/g-plugin-3d";
import { Plugin as ControlPlugin } from "@antv/g-plugin-control";

const renderer = new WebGLRenderer();
renderer.registerPlugin(new ThreeDPlugin());
renderer.registerPlugin(new ControlPlugin());
```

Then extend the runtime of G2 with 3D lib:

```ts
import { threedlib } from "@antv/g2-extension-3d";
import { Runtime, corelib, extend } from "@antv/g2";

const Chart = extend(Runtime, { ...corelib(), ...threedlib() });
const chart = new Chart({
  container: "container",
  renderer,
  depth: 400,
});
```

Now we can use 3D marks like this:

```ts
chart.point3D().data({});
```

⚠️ For now we only support Chart API and leave the Spec usage in the future.

## Scatter

[DEMO](https://g2.antv.antgroup.com/examples#threed-scatter)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*KNCUQqzw2JsAAAAAAAAAAAAADmJ7AQ/original" alt="scatter" width="400"/>

## Line

[DEMO](https://g2.antv.antgroup.com/examples#threed-line)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ak1iTZ1dpI0AAAAAAAAAAAAADmJ7AQ/original" alt="line" width="400"/>

## Bar

[DEMO](https://g2.antv.antgroup.com/examples#threed-bar)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZgMYT50XDQkAAAAAAAAAAAAADmJ7AQ/original" alt="surface" width="400"/>

## Surface

[DEMO](https://g2.antv.antgroup.com/examples#threed-surface)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4LJeR4SqvEoAAAAAAAAAAAAADmJ7AQ/original" alt="surface" width="400"/>

Use surface3D mark:

```ts
chart
  .surface3D()
  .data(points)
  .encode("x", "x")
  .encode("y", "y")
  .encode("z", "z")
  .encode("color", "z")
  .coordinate({ type: "cartesian3D" })
  .scale("x", { nice: true })
  .scale("y", { nice: true })
  .scale("z", { nice: true })
  .scale("color", { palette: "spectral" })
  .legend(false)
  .axis("x", { gridLineWidth: 1 })
  .axis("y", { gridLineWidth: 1, titleBillboardRotation: -Math.PI / 2 })
  .axis("z", { gridLineWidth: 1 })
  .style({
    palette: "spectral",
  });
```

## Run Test Cases

To run playwright, you must download new browsers first:

```bash
$npx playwright install
```
