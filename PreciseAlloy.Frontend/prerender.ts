/* eslint-disable no-console */
// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import crypto from 'node:crypto';

import jsBeautify, { CSSBeautifyOptions, HTMLBeautifyOptions, JSBeautifyOptions } from 'js-beautify';
import * as cheerio from 'cheerio';
import slash from 'slash';
import _ from 'lodash';
import { loadEnv } from 'vite';
import chalk from 'chalk';

interface RenderedPage {
  name: string;
  url: string;
  fileName: string;
}
const argvModeIndex = process.argv.indexOf('--mode');
const mode =
  argvModeIndex >= 0 && argvModeIndex < process.argv.length - 1 && !process.argv[argvModeIndex + 1].startsWith('-')
    ? process.argv[argvModeIndex + 1]
    : 'production';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const xpackEnv = loadEnv(mode, __dirname);
const toAbsolute = (p: string) => path.resolve(__dirname, p);
const log = console.log.bind(console);

const template = fs.readFileSync(toAbsolute(process.env.VITE_TEMPLATE ?? 'dist/static/index.html'), 'utf-8');
const { render, routesToPrerender } = await import(pathToFileURL(toAbsolute('./dist/server/entry-server.js')).href);

const beautifyOptions: HTMLBeautifyOptions | JSBeautifyOptions | CSSBeautifyOptions = {
  indent_size: 2,
  indent_char: ' ',
  keep_array_indentation: false,
  break_chained_methods: false,
  indent_scripts: 'normal',
  brace_style: 'collapse',
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
  max_preserve_newlines: 5,
  preserve_newlines: true,
};

// determine routes to pre-render from src/pages

const updateResourcePath = ($: cheerio.CheerioAPI, tagName: string, attr: string, addHash: boolean) => {
  $(tagName).each((_, el) => {
    const href = $(el).attr(attr);

    if (href && href.startsWith('/')) {
      let newPath = href;

      if (process.env.VITE_DOMAIN) {
        newPath = process.env.VITE_DOMAIN + newPath;
      }

      if (
        href.startsWith(xpackEnv.VITE_BASE_URL) &&
        !href.startsWith(xpackEnv.VITE_BASE_URL + 'assets/vendors/') &&
        ['.css', '.ico', '.js', '.webmanifest', '.svg'].includes(path.extname(href).toLowerCase()) &&
        !/\.0x[a-z0-9]{8}\.\w+$/gi.test(href)
      ) {
        const path = toAbsolute('dist/static/' + href.substring(xpackEnv.VITE_BASE_URL.length));

        if (fs.existsSync(path)) {
          const content = fs.readFileSync(path);
          const sha1Hash = crypto.createHash('sha1');

          sha1Hash.update(content);
          const hash = sha1Hash.digest('base64url').substring(0, 10);

          if (addHash) {
            newPath += '?v=' + hash;
          }
        } else if (path.endsWith('mock-api.js')) {
          // Skip
        } else {
          // Log warning
          log(chalk.yellow('Cannot find:', path));
        }
      }

      if (newPath != href) {
        $(el).attr(attr, newPath);
      }
    }
  });
};

const removeStyleBase = ($: cheerio.CheerioAPI) => {
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');

    if (href?.includes('style-base')) {
      $(el).remove();
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

const viteAbsoluteUrl = (remain: string, addExtension = false): string => {
  const baseUrl = xpackEnv.VITE_BASE_URL;
  const normalizedRemain =
    (remain?.startsWith('/') ? remain : '/' + remain) + (addExtension && !remain.endsWith('/') ? (xpackEnv.VITE_PATH_EXTENSION ?? '') : '');

  if (!baseUrl) {
    return normalizedRemain;
  }

  if (!baseUrl.endsWith('/')) {
    return baseUrl + normalizedRemain;
  }

  const len = baseUrl.length;

  return baseUrl.substring(0, len - 1) + normalizedRemain;
};

const renderPage = async (renderedPages: RenderedPage[], addHash: boolean) => {
  // pre-render each route...
  for (const route of routesToPrerender) {
    const output = await render(viteAbsoluteUrl(route.route, true));

    const destLocalizedFolderPath = toAbsolute('dist/static');

    let html = template.replace('<!--app-html-->', output.html ?? '').replace('@style.scss', '/assets/css/' + route.name + '.css');
    const $ = cheerio.load(html);
    const paths: string[] = [];

    removeDuplicateAssets($, 'link[data-pl-require][href]', 'href', paths);
    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);
    updateResourcePath($, 'link', 'href', addHash);
    updateResourcePath($, 'script', 'src', addHash);
    updateResourcePath($, 'img', 'src', addHash);
    if (route.route === '/') {
      removeStyleBase($);
    }

    $('head title').text(route.name);

    const fileName = (route.route === '/' ? '/index' : route.route) + '.html';
    const filePath = `${destLocalizedFolderPath}${fileName}`;

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    html = $.html();

    html = jsBeautify.html_beautify(html, beautifyOptions);
    html = html.replace('/* app-styles */', output.styles);

    fs.writeFileSync(toAbsolute(filePath), html);
    log('pre-rendered:', slash(filePath));

    renderedPages.push({
      name: _.kebabCase(fileName.replaceAll(/\.\w+$/gi, '')),
      url: `${process.env.VITE_DOMAIN ?? ''}${fileName}`,
      fileName: fileName,
    });
  }
};

(async () => {
  const renderedPages: RenderedPage[] = [];
  const pool: Promise<unknown>[] = [];

  const addHash = !!process.argv.includes('--add-hash');

  pool.push(renderPage(renderedPages, addHash));

  await Promise.all(pool);
})();
