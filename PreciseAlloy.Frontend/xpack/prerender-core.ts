import path from 'path';
import crypto from 'node:crypto';

import * as cheerio from 'cheerio';

import { normalizeTextLikeContent } from './text-normalization';

export interface PrerenderArgs {
  mode: string;
  addHash: boolean;
}

export interface ResourcePathOptions {
  addHash: boolean;
  baseUrl: string;
  domain?: string;
  toAbsolute: (value: string) => string;
  existsSync: (value: string) => boolean;
  readFileSync: (value: string) => Buffer;
  onMissingPath?: (value: string) => void;
}

export const hasContentHashInFileName = (value: string) => {
  return /\.0x[a-z0-9_-]{8,12}\.\w+$/gi.test(value);
};

export const hashFileContent = (content: string | Buffer) => {
  const sha1Hash = crypto.createHash('sha1');

  sha1Hash.update(content);

  return sha1Hash.digest('base64url').substring(0, 10);
};

export const parsePrerenderArgs = (argv: string[]): PrerenderArgs => {
  const argvModeIndex = argv.indexOf('--mode');
  const mode =
    argvModeIndex >= 0 && argvModeIndex < argv.length - 1 && !argv[argvModeIndex + 1].startsWith('-') ? argv[argvModeIndex + 1] : 'production';

  return {
    mode,
    addHash: argv.includes('--add-hash'),
  };
};

export const viteAbsoluteUrl = (
  { baseUrl, pathExtension = '' }: { baseUrl: string; pathExtension?: string },
  remain: string,
  addExtension = false
): string => {
  const normalizedRemain = (remain?.startsWith('/') ? remain : '/' + remain) + (addExtension && !remain.endsWith('/') ? pathExtension : '');

  if (!baseUrl) {
    return normalizedRemain;
  }

  if (!baseUrl.endsWith('/')) {
    return baseUrl + normalizedRemain;
  }

  return baseUrl.substring(0, baseUrl.length - 1) + normalizedRemain;
};

export const getUpdatedResourcePath = (href: string, options: ResourcePathOptions) => {
  if (!href.startsWith('/')) {
    return href;
  }

  let newPath = href;

  if (options.domain) {
    newPath = options.domain + newPath;
  }

  if (
    href.startsWith(options.baseUrl) &&
    !href.startsWith(options.baseUrl + 'assets/vendors/') &&
    ['.css', '.ico', '.js', '.webmanifest', '.svg'].includes(path.extname(href).toLowerCase()) &&
    !hasContentHashInFileName(href)
  ) {
    const absolutePath = options.toAbsolute('dist/static/' + href.substring(options.baseUrl.length));

    if (options.existsSync(absolutePath)) {
      if (options.addHash) {
        newPath += '?v=' + hashFileContent(normalizeTextLikeContent(href, options.readFileSync(absolutePath)));
      }
    } else if (!absolutePath.endsWith('mock-api.js')) {
      options.onMissingPath?.(absolutePath);
    }
  }

  return newPath;
};

export const updateResourcePath = ($: cheerio.CheerioAPI, tagName: string, attr: string, options: ResourcePathOptions) => {
  $(tagName).each((_, element) => {
    const href = $(element).attr(attr);

    if (!href) {
      return;
    }

    const newPath = getUpdatedResourcePath(href, options);

    if (newPath !== href) {
      $(element).attr(attr, newPath);
    }
  });
};

export const removeStyleBase = ($: cheerio.CheerioAPI) => {
  $('link[rel="stylesheet"]').each((_, element) => {
    const href = $(element).attr('href');

    if (href?.includes('style-base')) {
      $(element).remove();
    }
  });
};

export const removeDuplicateAssets = ($: cheerio.CheerioAPI, selector: string, attr: string, paths: string[]) => {
  $(selector).each((_, element) => {
    if ($(element).attr('data-pl-inplace') === 'true') {
      return;
    }

    const resourcePath = $(element).attr(attr);

    if (!resourcePath) {
      return;
    }

    const index = $(element).index();
    const parent = $(element).parent().clone();
    const child = parent.children()[index];

    parent.empty();
    parent.append(child);
    const html = parent.html();

    $(element).after('\n<!-- ' + html + ' -->');

    if (paths.includes(resourcePath)) {
      $(element).remove();

      return;
    }

    paths.push(resourcePath);
    $(element).removeAttr('data-pl-require');

    if ($(element).attr('type') === 'module') {
      const deferValue = $(element).attr('defer');

      if ($(element).attr('defer') === '' || deferValue === 'defer' || deferValue === 'true') {
        $(element).removeAttr('defer');
      }
    }

    $('head').append(element);
  });
};
