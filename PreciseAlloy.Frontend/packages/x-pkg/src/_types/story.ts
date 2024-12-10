import { FC } from 'react';

export interface StoryCollectionMeta {
  $$name: string;
  $$path: string;
}

export interface Story {
  name: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: FC<any>;
}
