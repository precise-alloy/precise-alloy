import { PreRenderedAsset, PreRenderedChunk } from 'rollup';

// console.log('filename');

export const getAssetFileName = (chunkInfo: PreRenderedAsset): string => {
  // console.log('getAssetFileName');
  // console.log(chunkInfo);

  if (!chunkInfo.name) {
    return '';
  }

  const match = /^(.*?)(?:\.entry)?\.(\w+)$/gi.exec(chunkInfo.name);

  if (!match) {
    return chunkInfo.name;
  }

  const name = match[1].toLowerCase();
  const ext = match[2].toLowerCase();

  if (ext === 'css') {
    return `assets/${ext}/${name}.css`;
  }

  return chunkInfo.name;
};

export const getEntryFileName = (chunkInfo: PreRenderedChunk): string => {
  // console.log('getEntryFileName');

  return 'assets/js/' + chunkInfo.name + '.js';
};

export const getChunkFileName = (chunkInfo: PreRenderedChunk): string => {
  // console.log('getChunkFileName');

  return 'assets/js/' + chunkInfo.name + '.js';
};
