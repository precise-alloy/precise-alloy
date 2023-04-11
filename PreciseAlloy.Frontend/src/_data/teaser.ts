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
    src: '/samples/image-3.svg'
  }
}

const teaserImageLeft: TeaserModel = {
  ...teaser,
  styleModifier: ['image-left'],
  image: {
    src: '/samples/image-2.svg'
  }
}

export { teaser, teaserImageLeft }