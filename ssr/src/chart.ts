import { G2Context, render, stdlib } from '@antv/g2';
import { createCanvas as createNodeCanvas } from 'canvas';
import { existsSync, lstatSync, writeFileSync } from 'fs';
import { createCanvas } from './canvas';
import type { Chart, MetaData, Options } from './types';
import { RendererPlugin } from "@antv/g";

function getInfoOf(options: Options) {
  const { outputType, imageType } = options;
  if (outputType === 'pdf') return ['.pdf', 'application/pdf'] as const;
  if (outputType === 'svg') return ['.svg', undefined] as const;

  if (imageType === 'jpeg') return ['.jpeg', 'image/jpeg'] as const;
  return ['.png', 'image/png'] as const;
}

function updateLight() {
  const lib = stdlib();
  const background = (name, color) => {
    const n = `theme.${name}`;
    const Theme = lib[n];
    const theme = Theme();
    theme.view.viewFill = color;
    lib[n] = () => theme;
  };
  background('light', 'white');
  background('classic', 'white');
  return lib;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createChart(
  options: Options,
  plugins: RendererPlugin[] = []
): Promise<Chart> {
  const {
    width = 640,
    height = 480,
    outputType,
    waitForRender = 16,
    ...restOptions
  } = options;
  const [gCanvas, nodeCanvas] = createCanvas(options, plugins);

  const context: G2Context = {
    canvas: gCanvas,
    library: updateLight(),
    createCanvas: () =>
      createNodeCanvas(
        300,
        150,
        outputType as 'svg' | 'pdf'
      ) as unknown as HTMLCanvasElement,
  };

  await new Promise<void>((resolve) =>
    render({ width, height, animate: false, ...restOptions }, context, resolve)
  );

  await sleep(waitForRender);

  const [extendName, mimeType] = getInfoOf(options);

  const chart: Chart = {
    exportToFile: (file: string, meta: MetaData) => {
      if (!file.endsWith(extendName)) {
        if (!existsSync(file)) file += extendName;
        else if (lstatSync(file).isDirectory())
          file = `${file}/image${extendName}`;
        else file += extendName;
      }
      // @ts-expect-error skip type check
      writeFileSync(file, nodeCanvas.toBuffer(mimeType, meta));
    },

    // @ts-expect-error skip type check
    toBuffer: (meta?: MetaData) => nodeCanvas.toBuffer(mimeType, meta),

    destroy: () => {
      gCanvas.destroy();
    },
  };

  return chart as Chart;
}
