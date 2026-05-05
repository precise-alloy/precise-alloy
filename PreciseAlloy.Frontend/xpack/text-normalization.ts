export const isTextLikePath = (filePath: string): boolean => {
  const pathWithoutQuery = filePath.split(/[?#]/, 1)[0];

  return /\.(?:css|cjs|htm|html|js|json|jsx|map|md|mjs|scss|svg|ts|tsx|txt|webmanifest|xml)$/i.test(pathWithoutQuery);
};

export const normalizeTextLineEndings = (text: string): string => text.replace(/\r\n?/g, '\n');

export const isTextLikeContent = (content: string | Buffer): boolean => {
  if (typeof content === 'string') {
    return true;
  }

  if (content.length === 0) {
    return true;
  }

  const sample = content.subarray(0, Math.min(content.length, 4096));

  if (sample.includes(0) || sample.toString('utf-8').includes('\uFFFD')) {
    return false;
  }

  const disallowedControlBytes = sample.filter((byte) => byte < 32 && byte !== 9 && byte !== 10 && byte !== 12 && byte !== 13).length;

  return disallowedControlBytes / sample.length <= 0.01;
};

export const normalizeSourceMapLineEndings = (text: string): string => {
  try {
    const sourceMap = JSON.parse(text) as { sourcesContent?: unknown };

    if (!Array.isArray(sourceMap.sourcesContent)) {
      return text;
    }

    const originalSourcesContent = sourceMap.sourcesContent;
    const sourcesContent = originalSourcesContent.map((sourceContent) => {
      return typeof sourceContent === 'string' ? normalizeTextLineEndings(sourceContent) : sourceContent;
    });

    if (sourcesContent.every((sourceContent, index) => sourceContent === originalSourcesContent[index])) {
      return text;
    }

    sourceMap.sourcesContent = sourcesContent;

    return JSON.stringify(sourceMap);
  } catch {
    return text;
  }
};

export const normalizeTextFileContent = (filePath: string, text: string): string => {
  const normalizedText = normalizeTextLineEndings(text);

  return /\.map(?:[?#]|$)/i.test(filePath) ? normalizeSourceMapLineEndings(normalizedText) : normalizedText;
};

export const normalizeTextLikeContent = (filePath: string, content: string | Buffer): string | Buffer => {
  if (!isTextLikePath(filePath) && !isTextLikeContent(content)) {
    return content;
  }

  return normalizeTextFileContent(filePath, typeof content === 'string' ? content : content.toString('utf-8'));
};
