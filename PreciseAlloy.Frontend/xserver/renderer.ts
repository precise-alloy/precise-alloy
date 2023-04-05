import fs from 'fs';
import { Express } from 'express';
import { ViteDevServer } from 'vite';
import * as cheerio from 'cheerio';
import jsBeautify, { CSSBeautifyOptions, HTMLBeautifyOptions, JSBeautifyOptions } from 'js-beautify';
import path from 'path';
import { fileURLToPath } from 'node:url';
import _ from 'lodash';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, p);
const addHash = true;

interface Props {
  app: Express;
  indexProd: string;
  isProd: boolean;
  viteDevServer: ViteDevServer | undefined;
  resolve: (path: string) => string;
}

const beautifyOptions: HTMLBeautifyOptions | JSBeautifyOptions | CSSBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'expand',
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: false,
  wrap_line_length: 0,
  indent_inner_html: false,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
  wrap_attributes: 'force',
};

const updateResourcePath = ($: cheerio.CheerioAPI, tagName: string, attr: string, addHash: boolean) => {
  $(tagName).each((_, el) => {
    const href = $(el).attr(attr);

    if (href && href.startsWith('/')) {
      let newPath = href;

      if (process.env.VITE_DOMAIN) {
        newPath = process.env.VITE_DOMAIN + newPath;
      }

      if (
        href.startsWith('/') &&
        !href.startsWith('/assets/vendors/') &&
        ['.css', '.ico', '.js', '.webmanifest', '.svg'].includes(path.extname(href).toLowerCase()) &&
        !/\.0x[a-z0-9]{8}\.\w+$/gi.test(href)
      ) {
        newPath += '?v=' + new Date().getTime();
      }

      if (newPath != href) {
        $(el).attr(attr, newPath);
      }
    }
  });
};

const removeDuplicateAssets = ($: cheerio.CheerioAPI, selector: string, attr: string, paths: string[]) => {
  $(selector).each((_, el) => {
    if ($(el).attr('data-pl-inplace') === 'true') {
      return;
    }

    const path = $(el).attr(attr);
    if (!path) {
      return;
    }

    const index = $(el).index();
    const parent = $(el).parent().clone();
    const child = parent.children()[index];
    parent.empty();
    parent.append(child);
    const html = parent.html();

    $(el).after('\n<!-- ' + html + ' -->');

    if (paths.includes(path)) {
      $(el).remove();
      return;
    }

    paths.push(path);
    $('head').append(el);
  });
};

const useRenderer = ({ app, indexProd, isProd, viteDevServer, resolve }: Props) => {
  app.use('*', async (req, res) => {
    try {
      let template, render;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await viteDevServer!.transformIndexHtml(req.originalUrl, template);
        render = (await viteDevServer!.ssrLoadModule(resolve('src/entry-server.tsx'))).render;
      } else {
        template = indexProd;
        // @ts-ignore
        render = (await import(resolve('dist/server/entry-server.js'))).render;
      }

      const context: { url?: string } = {};
      const output = render(req.originalUrl);

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url);
      }

      const html = template.replace(`<!--app-html-->`, output.html);
      const $ = cheerio.load(html);
      const paths: string[] = [];
      removeDuplicateAssets($, 'link[data-pl-require][rel="stylesheet"][href]', 'href', paths);
      removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);
      updateResourcePath($, 'link', 'href', addHash);
      updateResourcePath($, 'script', 'src', addHash);
      updateResourcePath($, 'img', 'src', addHash);

      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(jsBeautify.html_beautify($.html(), beautifyOptions).replace('/* app-styles */', output.styles));
    } catch (e: any) {
      !isProd && viteDevServer!.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });
};

export { useRenderer };
