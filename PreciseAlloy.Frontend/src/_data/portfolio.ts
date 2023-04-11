import { PortfolioModel } from "@_types/types"

const portfolio: PortfolioModel = {
  globalModifier: ['section-margin-top'],
  label: 'PORTFOLIO',
  header: {
    heading: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
    headingLevel: 'h1'
  },
  description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae, porro?',
  images: [
    {
      src: '/samples/sample-1.svg'
    },
    {
      src: '/samples/sample-2.svg'
    },
    {
      src: '/samples/sample-3.svg'
    },
    {
      src: '/samples/sample-4.svg'
    },
    {
      src: '/samples/sample-5.svg'
    },
    {
      src: '/samples/sample-6.svg'
    },
    {
      src: '/samples/sample-7.svg'
    },
    {
      src: '/samples/sample-8.png'
    }
  ],
  button: {
    text: 'Learn more',
    styleModifier: ['btn', 'btn-black'],
    link: true,
    href: 'https://www.facebook.com/'
  }
}

export { portfolio }