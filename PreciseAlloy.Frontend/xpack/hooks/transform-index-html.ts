import { PluginOption } from "vite"

const transformIndexHtml = (baseUrl: string): PluginOption => {
  // console.log('[INIT] transformIndexHtml');

  return {
    name: 'xpack-transform-index-html',
    enforce: 'post',

    transformIndexHtml(html) {
      // console.log('transformIndexHtml');

      console.log(html);
      return html.replaceAll('__BASE_URL__/', baseUrl);
    }
  }
}

export default transformIndexHtml;
