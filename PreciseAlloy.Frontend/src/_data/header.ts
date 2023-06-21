import { HeaderModel } from "@_types/organisms";

const header: HeaderModel = {
  title: "Start",
  navlinks: {
    links: [
      { text: "Home", url: '/' },
      { text: "Porforlio", url: '/pages/portfolio' },
      { text: "Services", url: '/pages/service' },
      { text: "Contact Us", url: '/pages/contact' },
    ],
  }
}

export { header }