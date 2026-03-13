import { api as viewerApi } from 'v-viewer';
import 'viewerjs/dist/viewer.css';

/**
 * 图片预览
 * @param urls 图片urls 支持单图和图片数组
 * @param options Viewer.Options
 */
export const imageViewer = (urls?: string | (string | object)[], options?: Viewer.Options) => {
  if (!urls?.length) return;
  viewerApi({
    images: Array.isArray(urls) ? urls : [urls],
    options: {
      zIndex: 9999,
      zIndexInline: 9999,
      ...options
    }
  });
};
