/* eslint-disable no-console */
// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import jsBeautify, { CSSBeautifyOptions, HTMLBeautifyOptions, JSBeautifyOptions } from 'js-beautify';
import * as cheerio from 'cheerio';
import slash from 'slash';
import _ from 'lodash';
import { loadEnv } from 'vite';
import chalk from 'chalk';

import { parsePrerenderArgs, removeDuplicateAssets, removeStyleBase, updateResourcePath, viteAbsoluteUrl } from './prerender-core';

interface RenderedPage {
  name: string;
  url: string;
  fileName: string;
}
const { mode, addHash } = parsePrerenderArgs(process.argv);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const xpackEnv = loadEnv(mode, projectRoot);
const toAbsolute = (p: string) => path.resolve(projectRoot, p);
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

const renderPage = async (renderedPages: RenderedPage[], addHash: boolean) => {
  // pre-render each route...
  for (const route of routesToPrerender) {
    const output = await render(viteAbsoluteUrl({ baseUrl: xpackEnv.VITE_BASE_URL, pathExtension: xpackEnv.VITE_PATH_EXTENSION }, route.route, true));

    const destLocalizedFolderPath = toAbsolute('dist/static');

    let html = template.replace('<!--app-html-->', output.html ?? '').replace('@style.scss', '/assets/css/' + route.name + '.css');
    const $ = cheerio.load(html);
    const paths: string[] = [];
    const resourcePathOptions = {
      addHash,
      baseUrl: xpackEnv.VITE_BASE_URL,
      domain: process.env.VITE_DOMAIN,
      toAbsolute,
      existsSync: fs.existsSync,
      readFileSync: fs.readFileSync,
      onMissingPath: (resourcePath: string) => log(chalk.yellow('Cannot find:', resourcePath)),
    };

    removeDuplicateAssets($, 'link[data-pl-require][href]', 'href', paths);
    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);
    updateResourcePath($, 'link', 'href', resourcePathOptions);
    updateResourcePath($, 'script', 'src', resourcePathOptions);
    updateResourcePath($, 'img', 'src', resourcePathOptions);
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

  pool.push(renderPage(renderedPages, addHash));

  await Promise.all(pool);
})();
