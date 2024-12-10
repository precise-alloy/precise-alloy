import { Story, StoryCollectionMeta } from '@_types/story';
import { footer } from '@data/footer';
import Template from '@templates/about/About';

export default {
  $$name: 'About',
  $$path: 'about',
} as StoryCollectionMeta;

export const About: Story = {
  name: 'About Page - Default',
  path: 'default',
  render: () => <Template footer={footer} />,
};
