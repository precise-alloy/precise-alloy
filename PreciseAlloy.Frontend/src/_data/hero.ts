import { HeroModel } from '@_types/types';

const hero: HeroModel = {
  label: 'WELCOME',
  header: {
    heading: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
    headingLevel: 'h1'
  },
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit laboriosam aliquam est exercitationem quo reiciendis asperiores veritatis placeat porro earum? Libero tempora impedit rerum quae aspernatur nostrum quod fuga quasi.',
  button: {
    text: 'Explore',
    styleModifier: ['btn']
  },
  image: {
    src: '/samples/image-1.svg',
    width: '590',
    height: '347',
    alt: 'hero image',
    lazy: false,
    sources: [
      {
        srcSet: '/samples/image-1.svg'
      }
    ]
  }
};

export { hero };
