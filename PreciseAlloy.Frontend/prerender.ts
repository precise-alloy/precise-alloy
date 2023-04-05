// Pre-render the app into static HTML.
// run `npm run generate` and then `dist/static` can be served as a static site.

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import jsBeautify, { CSSBeautifyOptions, HTMLBeautifyOptions, JSBeautifyOptions } from 'js-beautify';
import * as cheerio from 'cheerio';
import crypto from 'node:crypto';
import slash from 'slash';
import _ from 'lodash';

interface Route {
  name: string;
  route: string;
}

interface RenderedPage {
  name: string;
  url: string;
  fileName: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p: string) => path.resolve(__dirname, p);
const log = console.log.bind(console);

const template = fs.readFileSync(toAbsolute(process.env.VITE_TEMPLATE ?? 'dist/index.html'), 'utf-8');
const { render } = await import(pathToFileURL(toAbsolute('./dist/server/entry-server.js')).href);

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
const routesToPrerender = fs
  .readdirSync(toAbsolute('src/pages'))
  .map((file): Route => {
    const name = path.parse(file).name;
    const normalizedName = name.replaceAll(/^(\w+)/gi, (_p0, p1: string) =>
      _.lowerCase(
        p1.replaceAll(/(b2c|eshop)/gi, (_m0, m1: string) => {
          return m1.toLowerCase();
        })
      )
        .replaceAll(' ', '-')
        .replaceAll('b-2-c', 'b2c')
    );

    return {
      name: _.startCase(_.lowerCase(name)),
      route: name === 'Root' ? '/' : `/pages/${normalizedName}`,
    };
  })
  .filter((r) => r.name != 'root');

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
        const content = fs.readFileSync(toAbsolute('dist/static' + href));
        const sha1Hash = crypto.createHash('sha1');
        sha1Hash.update(content);
        const hash = sha1Hash.digest('hex').substring(0, 8);

        if (addHash) {
          newPath += '?v=' + hash;
        }
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

const renderPage = async (renderedPages: RenderedPage[], addHash: boolean) => {
  // pre-render each route...
  for (const route of routesToPrerender) {
    const output = await render(route.route);

    const destLocalizedFolderPath = toAbsolute('dist/static');

    let html = template.replace(`<!--app-html-->`, output!.html).replace('@style.scss', '/assets/css/' + route.name + '.css');
    const $ = cheerio.load(html);
    const paths: string[] = [];
    removeDuplicateAssets($, 'link[data-pl-require][rel="stylesheet"][href]', 'href', paths);
    removeDuplicateAssets($, 'script[data-pl-require][src]', 'src', paths);
    updateResourcePath($, 'link', 'href', addHash);
    updateResourcePath($, 'script', 'src', addHash);
    updateResourcePath($, 'img', 'src', addHash);

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
  const pool: Promise<any>[] = [];

  const assetCopyPaths: { src: string; dest: string }[] = [
    {
      src: toAbsolute('public/assets/css'),
      dest: toAbsolute('dist/static/assets/css'),
    },
    {
      src: toAbsolute('dist/assets/js'),
      dest: toAbsolute('dist/static/assets/js'),
    },
    {
      src: toAbsolute('public/assets/vendors'),
      dest: toAbsolute('dist/static/assets/vendors'),
    },
  ];

  assetCopyPaths.forEach((item) => {
    if (fs.existsSync(item.dest)) {
      fs.rmSync(item.dest, { recursive: true, force: true });
    }

    if (fs.existsSync(item.src)) {
      fs.mkdirSync(item.dest);
      fs.cpSync(item.src, item.dest, { recursive: true, force: true });
    }
  });

  const addHash = !!process.argv.includes('--add-hash');
  pool.push(renderPage(renderedPages, addHash));

  await Promise.all(pool);
})();
