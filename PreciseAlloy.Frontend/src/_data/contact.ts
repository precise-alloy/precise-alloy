import { ContactModel } from "@_types/organisms";

const contact: ContactModel = {
  globalModifier: ['section-margin-top'],
  header: { heading: "Contact Us", headingLevel: "h1" },
  description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.',
  form: {
    name: { label: "Name", name: "inputName", id: "idName", required: true },
    email: { label: "Email", name: "inputEmail", id: "idEmail", required: true },
    message: { label: "Message", name: "inputMessage", id: "idMessage", required: true },
    submitButton: {
      text: "Submit",
      styleModifier: ['btn', 'btn-black'],
    }
  }
}

export { contact }