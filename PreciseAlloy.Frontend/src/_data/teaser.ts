import { TeaserModel } from "@_types/types"

const teaser: TeaserModel = {
  globalModifier: ['section-margin-top-xl'],
  header: {
    heading: 'Lorem Ipsum Dolor Sit Amet Consectetur.'
  },
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit laboriosam aliquam est exercitationem quo reiciendis asperiores veritatis placeat porro earum? Libero tempora impedit rerum quae aspernatur nostrum quod fuga quasi.',
  button: {
    text: 'Explore',
    styleModifier: ['btn', 'btn-black']
  },
  image: {
    src: '/samples/image-3.svg',
    width: '600',
    height: '432',
    alt: 'teaser image'
  }
}

const teaserImageLeft: TeaserModel = {
  ...teaser,
  styleModifier: ['image-left'],
  image: {
    src: '/samples/image-2.svg',
    width: '600',
    height: '432',
    alt: 'teaser image'
  }
}

export { teaser, teaserImageLeft }