import { EventListenerModel } from "./_types";
import center from "./event";


export default function mock(model: EventListenerModel) {
  center.addEventListener(model);
}
