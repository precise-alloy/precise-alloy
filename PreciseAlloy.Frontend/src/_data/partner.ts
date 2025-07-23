import { PartnerModel } from '@_types/types';

const partner: PartnerModel = {
  globalModifier: ['section-margin-top'],
  label: 'PARTNERS',
  header: {
    heading: 'Lorem Ipsum Dolor',
  },
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, porro?',
  images: [
    {
      src: '/samples/Google.svg',
      width: '153',
      height: '50',
      alt: 'partner 1',
    },
    {
      src: '/samples/Microsoft.svg',
      width: '212',
      height: '46',
      alt: 'partner 2',
    },
    {
      src: '/samples/Airbnb.svg',
      width: '161',
      height: '50',
      alt: 'partner 3',
    },
    {
      src: '/samples/Facebook.svg',
      width: '198',
      height: '38',
      alt: 'partner 4',
    },
    {
      src: '/samples/Spotify.svg',
      width: '167',
      height: '50',
      alt: 'partner 5',
    },
  ],
  button: {
    styleModifier: ['btn', 'btn-black'],
    text: 'Learn More',
    link: true,
    href: 'https://www.twitter.com/',
    target: '_blank',
  },
};

export { partner };
