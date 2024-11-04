import { Renderer } from '@antv/g-canvas';
import { Canvas as GCanvas } from '@antv/g';
import type { Canvas as NodeCanvas } from 'canvas';
import { createCanvas as createNodeCanvas } from 'canvas';
import type { Options } from './types';

/**
 * <zh/> 创建画布
 *
 * <en/> create canvas
 * @param options <zh/> options 画布配置 | <en/> options canvas configuration
 * @returns <zh/> [G 画布, NodeCanvas 画布] | <en/> [GCanvas, NodeCanvas]
 */
export function createCanvas(options: Options): [GCanvas, NodeCanvas] {
  const { width = 640, height = 480, outputType } = options;
  const nodeCanvas = createNodeCanvas(width, height, outputType as any);
  const offscreenNodeCanvas = createNodeCanvas(1, 1);

  const renderer = new Renderer();
  const htmlRendererPlugin = renderer.getPlugin('html-renderer');
  const domInteractionPlugin = renderer.getPlugin('dom-interaction');
  renderer.unregisterPlugin(htmlRendererPlugin);
  renderer.unregisterPlugin(domInteractionPlugin);

  const gCanvas = new GCanvas({
    width,
    height,
    renderer,
    devicePixelRatio: 2,
    // @ts-expect-error missing types
    canvas: nodeCanvas,
    // @ts-expect-error missing types
    offscreenCanvas: offscreenNodeCanvas,
  });

  return [gCanvas, nodeCanvas];
}
