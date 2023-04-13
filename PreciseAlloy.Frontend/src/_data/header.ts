import { HeaderModel } from "@_types/organisms";
import { url } from "inspector";

const header: HeaderModel = {
  title: "Start",
  navlinks: {
    links: [
      { text: "Home", url: '/' },
      { text: "Porforlio", url: '/pages/portfolio' },
      { text: "Services", url: '/pages/service' },
      { text: "Contact", url: '/pages/contact' },
    ],
  }
}

export { header }