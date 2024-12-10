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
      src: '/samples/sample-1.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 1',
    },
    {
      src: '/samples/sample-2.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 2',
    },
    {
      src: '/samples/sample-3.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 3',
    },
    {
      src: '/samples/sample-4.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 4',
    },
    {
      src: '/samples/sample-5.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 5',
    },
    {
      src: '/samples/sample-6.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 6',
    },
    {
      src: '/samples/sample-7.svg',
      width: '570',
      height: '335',
      alt: 'portfolio 7',
    },
    {
      src: '/samples/sample-8.png',
      width: '570',
      height: '335',
      alt: 'portfolio 8',
    }
  ],
  button: {
    text: 'Learn more',
    styleModifier: ['btn', 'btn-black'],
    link: true,
    href: 'https://www.office.com/'
  }
}

export { portfolio }