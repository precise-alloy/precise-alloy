import { Story, StoryCollectionMeta } from '@_types/story';
import { alert } from '@data/alert';
import { contact } from '@data/contact';
import { footer } from '@data/footer';
import { header } from '@data/header';
import ContactTemplate from '@templates/contact/Contact';

const Portfolio = () => {
  return <ContactTemplate header={header} footer={footer} contact={contact} alert={alert} />;
};

// export default Portfolio;

export default {
  $$name: 'Contact',
  $$path: 'contact',
} as StoryCollectionMeta;

export const About: Story = {
  name: 'Contact Page - Default',
  path: 'default',
  render: Portfolio,
};
