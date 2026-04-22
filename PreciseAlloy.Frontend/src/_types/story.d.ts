type StoryCollectionMeta = {
  $$name: string;
  $$path: string;
};

type Story = {
  name: string;
  path: string;

  render: import('react').FC<any>;
};
