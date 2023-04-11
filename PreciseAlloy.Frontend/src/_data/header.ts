import { HeaderModel } from "@_types/organisms";
import { url } from "inspector";

const header: HeaderModel = {
  title: "Start",
  navlinks: {
    links: [
      { text: "Home", url: 'https://www.google.com/' },
      { text: "Porforlio", url: 'https://www.google.com/' },
      { text: "Services", url: 'https://www.google.com/' },
      { text: "Contact", url: 'https://www.google.com/' },
    ],
  }
}

export { header }