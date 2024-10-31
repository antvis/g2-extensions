import type { G2Spec } from '@antv/g2';
import { PdfConfig, PngConfig } from 'canvas';

export type Options = G2Spec & {
  width: number;
  height: number;
  /**
   * <zh/> 输出文件类型，默认导出为图片
   *
   * <en/> output file type, default export as image
   * @defaultValue 'image'
   */
  outputType?: 'image' | 'pdf' | 'svg';
};

export type MetaData = PdfConfig | PngConfig;

export interface Chart {
  exportToFile: (file: string, meta?: MetaData) => void;
  toBuffer: (meta?: MetaData) => Buffer;
  destroy: () => void;
}
