## SSR extension for G2 5.0

This extension package provides SSR support for G2 5.0, which supports canvas rendering in server side.

## Usage

### Install

```bash
npm install @antv/g2-ssr
```

### Render in JavaScript API

> For complete options, please refer to [G2 Spec](https://g2.antv.antgroup.com/spec/overview)

```js
import { createChart } from '@antv/g2-ssr';

const chart = await createChart({
  width: 640,
  height: 480,
  // chart spec
});

chart.exportToFile('chart');
// -> chart.png
```

### Render in CLI

```bash
npx g2-ssr export -i [chart-spec].json -o ./chart
```

### Export SVG / PDF

When render in JavaScript API, you can pass `outputType` option to export SVG or PDF.

```js
const chart = await createChart({
  width: 640,
  height: 480,
  outputType: 'svg', // or 'pdf'
  // chart spec
});
```

When render in CLI, you can pass `-t` or `--type` option to export SVG or PDF.

```bash
npx g2-ssr export -i [chart-spec].json -o ./file -t pdf
```

## License

MIT
