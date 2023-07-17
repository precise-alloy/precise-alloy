export interface EventModel {
  [eventID: string]: (req?: RequestInit) => MockResponseModel;
}

export interface MockResponseModel {
  headers?: object;
  ok?: boolean;
  status?: number;
  statusText?: string;
  type?: string;
  url?: string;
  body: object | string;
}

export interface EventListenerModel {
  url: string;
  callback: (req?: RequestInit) => MockResponseModel;
}

export interface DispatchModel {
  url: URL;
  req?: RequestInit;
}

declare global {
  interface Window {
    originFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  }
}
