import { RendererPlugin } from '@antv/g';
import type { G2Spec } from '@antv/g2';
import { PdfConfig, PngConfig, JpegConfig } from 'canvas';

export type Options = G2Spec & {
  width: number;
  height: number;
  devicePixelRatio?: number;
  /**
   * <zh/> 等待渲染的时间，默认为 32ms
   *
   * <en/> The time to wait for rendering, default is 16ms
   * @defaultValue 16
   */
  waitForRender?: number;
  /**
   * <zh/> 输出文件类型，默认导出为图片
   *
   * <en/> output file type, default export as image
   * @defaultValue 'image'
   */
  outputType?: 'image' | 'pdf' | 'svg';
  /**
   * <zh/> 图片类型，默认为 png
   *
   * <en/> Image type, default is png
   */
  imageType?: 'png' | 'jpeg';
  /**
   * <zh/> 插件
   *
   * <en/> Plugins
   */
  plugins?: RendererPlugin[];
};

export type MetaData = PdfConfig | PngConfig | JpegConfig;

export interface Chart {
  exportToFile: (file: string, meta?: MetaData) => void;
  toBuffer: (meta?: MetaData) => Buffer;
  destroy: () => void;
}
