# @antv/g2-extension-ava

The auto and insight marks for @antv/g2, powered by @antv/ava.

## Getting Started

Install `@antv/g2-extension-ava` and `@antv/g2` via package manager such NPM or Yarn.

```bash
$ npm install @antv/g2-extension-ava @antv/g2
```

Use mark individually:

```js
import { Chart } from "@antv/g2";
import { Auto } from "@antv/g2-extension-ava";

const chart = new Chart({ container: "container" });

chart.options({
  type: Auto,
  data: [
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ],
});

chart.render();
```

Use mark from the lib:

```js
import { Runtime, extend } from "@antv/g2";
import { autolib } from "@antv/g2-extension-ava";

const Chart = extend(Runtime, autolib);

const chart = new Chart({ container: "container" });

chart.options({
  type: "auto",
  data: [
    { genre: "Sports", sold: 275 },
    { genre: "Strategy", sold: 115 },
    { genre: "Action", sold: 120 },
    { genre: "Shooter", sold: 350 },
    { genre: "Other", sold: 150 },
  ],
});

chart.render();
```

## License

MIT@[AntV](https://github.com/antvis).
