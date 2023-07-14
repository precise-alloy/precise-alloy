import { DispatchModel, EventListenerModel, EventModel, MockResponseModel } from "./_types";

/**
 * Manager event
 * add event listener or dispatch event
 */
class EventCenter {
  public events: EventModel;

  constructor() {
    this.events = {}
  }

  /**
   * @param eventID
   * @param callback
   */
  addEventListener(model: EventListenerModel) {
    const { url, callback } = model;
    const obj = new URL(url, window.location.origin);

    this.events[obj.href] = callback;
  }

  /**
   * @param eventURL
   * @param req
   */
  dispatch(model: DispatchModel): MockResponseModel {
    const { url, req } = model;

    const callback = this.events[url.href];

    if (typeof callback === 'function') {
      return callback.call(this, req);
    }

    return {
      status: 404,
      body: {
        error: 'NOT FOUND'
      }
    }
  }
}

const center = new EventCenter();

export default center;
