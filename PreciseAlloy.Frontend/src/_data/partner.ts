import { PartnerModel } from "@_types/types"

const partner: PartnerModel = {
  globalModifier: ['section-margin-top'],
  label: 'PARTNERS',
  header: {
    heading: 'Lorem Ipsum Dolor'
  },
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, porro?',
  images: [
    {
      src: '/samples/Google.svg'
    },
    {
      src: '/samples/Microsoft.svg'
    },
    {
      src: '/samples/Airbnb.svg'
    },
    {
      src: '/samples/Facebook.svg'
    },
    {
      src: '/samples/Spotify.svg'
    },
  ],
  button: {
    styleModifier: ['btn', 'btn-black'],
    text: 'Learn More'
  },
}

export { partner }