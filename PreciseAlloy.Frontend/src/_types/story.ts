import { FC } from 'react';

export interface StoryCollectionMeta {
  $$name: string;
  $$path: string;
}

export interface Story {
  name: string;
  path: string;
  render: FC<any>;
}
