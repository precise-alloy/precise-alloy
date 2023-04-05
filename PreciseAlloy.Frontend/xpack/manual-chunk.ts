import path from 'path';
import { ManualChunkMeta } from 'rollup';
import slash from 'slash';
import { getAbsolutePath, srcRoot } from './paths';

// console.log('manual-chunk');

const getInternalName = (id: string, api: ManualChunkMeta): string | null | void => {
  const moduleInfo = api.getModuleInfo(id);
  if (!moduleInfo?.isEntry) {
    return;
  }

  const entryPath = getAbsolutePath(id);

  if (entryPath.startsWith(srcRoot)) {
    const relativePath = slash(path.relative(srcRoot, entryPath));
    const match = /^([a-z0-9.@_-]+?)\/([a-z0-9.@_-]+?)(\.[^\.]+)$/gi.exec(relativePath);
    if (match) {
      return match[1] + '~' + match[2];
    }
  }
};

const getExternalName = (_: string): string | null | void => {
  // const name = id
  //   .toString()
  //   .split('node_modules/')[1]
  //   .split('/')[0]
  //   .toString();

  // if (name === 'react') {
  //   return "react";
  // }

  // if (name === 'react-dom') {
  //   return "react-dom";
  // }

  // if (id.includes("@aws-amplify")) {
  //   return "vendor_aws";
  // }

  // else if (id.includes("@material-ui")) {
  //   return "vendor_mui";
  // }

  return 'vendor'; // all other package goes here
};

export const getManualChunk = (id: string, api: ManualChunkMeta): string | null | void => {
  if (id.includes('node_modules/')) {
    return getExternalName(id);
  } else {
    return getInternalName(id, api);
  }
};
