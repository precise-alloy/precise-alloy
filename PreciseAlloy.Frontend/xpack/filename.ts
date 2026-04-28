import _ from 'lodash';

// console.log('filename');

type AssetPathInfo = {
  name?: string;
  ext: string;
  noHash?: boolean;
};

export type PreRenderedAsset = {
  name?: string;
};

export type PreRenderedChunk = {
  name?: string;
};

const getAssetPath = ({ name, ext, noHash }: AssetPathInfo) => {
  const normalizedName = _.lowerCase(name).replaceAll(/(\s+)/gi, '-');

  if (noHash) {
    return `assets/js/${normalizedName}.${ext}`;
  }

  return `assets/js/${normalizedName}.0x[hash].${ext}`;
};

export const getAssetFileName = (chunkInfo: PreRenderedAsset): string => {
  // console.log('asset:', chunkInfo.name);
  return getAssetPath({ name: chunkInfo.name, ext: 'css' });
};

export const getEntryFileName = (chunkInfo: PreRenderedChunk): string => {
  // console.log('entry:', chunkInfo.name);
  if (chunkInfo.name === 'entry-server') {
    return chunkInfo.name + '.js';
  }

  if (chunkInfo.name === 'index') {
    return 'assets/js/react-loader.0x[hash].js';
  }

  return getAssetPath({ name: chunkInfo.name, ext: 'js', noHash: true });
};

export const getChunkFileName = (chunkInfo: PreRenderedChunk): string => {
  // console.log('chunk:', chunkInfo.name);
  return getAssetPath({ name: chunkInfo.name, ext: 'js' });
};
