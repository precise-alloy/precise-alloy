import { PeopleModel } from '@_types/organisms';

export const people: PeopleModel = {
  subHeader: 'Team',
  header: 'Our Talents',
  text: 'Lorem ipsum, dolor sit amet consectetur Suscipit nemo hic quos, ab,',
  items: [
    {
      name: 'Peg Legge',
      image: {
        src: '/samples/peg-legge.svg',
        width: '175',
        height: '175',
        alt: 'people 1',
      },
      jobTitle: 'CEO',
    },
    {
      name: 'Richard Guerra',
      image: {
        src: '/samples/richard-guerra.svg',
        width: '175',
        height: '175',
        alt: 'people 2',
      },
      jobTitle: 'CEO',
    },
    {
      name: 'Alexandra Stolz',
      image: {
        src: '/samples/alexandra-stolz.svg',
        width: '175',
        height: '175',
        alt: 'people 3',
      },
      jobTitle: 'CEO',
    },
    {
      name: 'Janet Bray',
      image: {
        src: '/samples/janet-bray.svg',
        width: '175',
        height: '175',
        alt: 'people 4',
      },
      jobTitle: 'CEO',
    },
  ],
  button: { text: 'View Team', link: true, href: 'https://www.google.com/', styleModifier: ['btn', 'btn-black'] },
};
