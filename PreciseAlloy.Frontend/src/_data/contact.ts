import { ContactModel } from "@_types/organisms";

const contact: ContactModel = {
  header: { heading: "Contact Us", headingLevel: "h1" },
  description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
  form: {
    name: { label: "Name", inputName: "inputName" },
    email: { label: "Email", inputName: "inputEmail" },
    message: { label: "Message", inputName: "inputMessage" },
    submitButton: {
      text: "Submit",
      styleModifier: ['btn', 'btn-black'],
    }
  }
}

export { contact }