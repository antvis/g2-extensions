import { existsSync, readFileSync } from 'fs';
import { createChart } from '../src';
import type { Chart, MetaData } from '../src';
import { join } from 'path';
import { Plugin as RoughCanvasPlugin } from '@antv/g-plugin-rough-canvas-renderer';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchFile(path: string, meta?: MetaData): R;
    }
  }
}

expect.extend({
  toMatchFile: (received: Chart, path: string, meta: MetaData) => {
    const _path = join(__dirname, path);
    const pass = existsSync(_path)
      ? received.toBuffer(meta).equals(readFileSync(_path))
      : true;
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      };
    } else {
      return {
        message: () => 'expected files are equal',
        pass: false,
      };
    }
  },
});

describe('createChart', () => {
  const fn = async (outputType?, imageType: any = 'png', options= {}) => {
    return await createChart({
      width: 300,
      height: 150,
      outputType,
      imageType,
      type: 'interval',
      autoFit: true,
      data: [
        { letter: 'A', frequency: 0.08167 },
        { letter: 'B', frequency: 0.01492 },
        { letter: 'C', frequency: 0.02782 },
        { letter: 'D', frequency: 0.04253 },
        { letter: 'E', frequency: 0.12702 },
        { letter: 'F', frequency: 0.02288 },
        { letter: 'G', frequency: 0.02015 },
        { letter: 'H', frequency: 0.06094 },
        { letter: 'I', frequency: 0.06966 },
        { letter: 'J', frequency: 0.00153 },
        { letter: 'K', frequency: 0.00772 },
        { letter: 'L', frequency: 0.04025 },
        { letter: 'M', frequency: 0.02406 },
        { letter: 'N', frequency: 0.06749 },
        { letter: 'O', frequency: 0.07507 },
        { letter: 'P', frequency: 0.01929 },
        { letter: 'Q', frequency: 0.00095 },
        { letter: 'R', frequency: 0.05987 },
        { letter: 'S', frequency: 0.06327 },
        { letter: 'T', frequency: 0.09056 },
        { letter: 'U', frequency: 0.02758 },
        { letter: 'V', frequency: 0.00978 },
        { letter: 'W', frequency: 0.0236 },
        { letter: 'X', frequency: 0.0015 },
        { letter: 'Y', frequency: 0.01974 },
        { letter: 'Z', frequency: 0.00074 },
      ],
      encode: { x: 'letter', y: 'frequency' },
      ...options,
    });
  };

  it('image png', async () => {
    const chart = await fn();

    expect(chart).toMatchFile('./assets/chart.png');

    chart.exportToFile(join(__dirname, './assets/chart'));

    chart.destroy();
  });

  it('image png with plugins', async () => {
    const chart = await fn('image', 'png', {
      renderPlugins: [
        new RoughCanvasPlugin({
          roughRendering: (value) => {
            return value.attributes.class !== 'area';
          },
        }),
      ],
      style: {
        fillStyle: 'zigzag',
        lineWidth: 2,
      },
    });

    expect(chart).toMatchFile('./assets/chart-rough.png');

    chart.exportToFile(join(__dirname, './assets/chart-rough.png'));

    chart.destroy();
  });

  it('image jpeg', async () => {
    const chart = await fn('image', 'jpeg');

    expect(chart).toMatchFile('./assets/chart.jpeg');

    chart.exportToFile(join(__dirname, './assets/chart'));

    chart.destroy();
  });

  it('file svg', async () => {
    const chart = await fn('svg');

    chart.exportToFile(join(__dirname, './assets/chart'));

    chart.destroy();
  });

  it.skip('file pdf', async () => {
    const chart = await fn('pdf');

    const metadata = {
      title: 'Chart',
      author: 'AntV',
      creator: 'Aaron',
      subject: 'Test',
      keywords: 'antv g2 chart pdf',
      creationDate: new Date(1730304000000), // 2024-10-31 00:00:00 UTC+8
      modDate: new Date(1730304000000), // 2024-10-31 00:00:00 UTC+8
    };

    expect(chart).toMatchFile('./assets/chart.pdf', metadata);

    chart.exportToFile(join(__dirname, './assets/chart'), metadata);

    chart.destroy();
  });

  it('image', async () => {
    const chart = await createChart({
      type: 'image',
      autoFit: true,
      data: [{ x: 0, y: 0 }],
      encode: {
        x: 'x',
        y: 'y',
        src: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
        size: 48,
      },
      axis: false,
      tooltip: false,
      waitForRender: 300,
    });

    expect(chart).toMatchFile('./assets/image.png');

    chart.exportToFile(join(__dirname, './assets/image'));

    chart.destroy();
  });
});
