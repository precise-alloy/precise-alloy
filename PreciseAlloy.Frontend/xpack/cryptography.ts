import crypto from 'node:crypto';

export type AssetMetadataItem = {
  version?: string;
  integrity: string;
};

export type AssetMetadata = {
  [path: string]: AssetMetadataItem;
};

export function getAssetVersion(content: Buffer | string): string {
  const sha1Hash = crypto.createHash('sha384');

  sha1Hash.update(content);

  return sha1Hash.digest('base64url').substring(0, 10);
}

export function getAssetHash(content: Buffer | string): string {
  const sha1Hash = crypto.createHash('sha384');

  sha1Hash.update(content);

  return sha1Hash.digest('base64');
}

export function getMetadata(content: Buffer | string, filename: string): AssetMetadataItem {
  const skipVersion = filename && /\.0x[a-z0-9_-]{8,12}\.\w+$/gi.test(filename);

  return {
    version: skipVersion ? undefined : getAssetVersion(content),
    integrity: 'sha384-' + getAssetHash(content),
  };
}
