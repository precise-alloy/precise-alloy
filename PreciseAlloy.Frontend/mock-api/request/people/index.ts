import mock from "@mock/core/mock";
import { peopleData } from "@mock/request/people/data";
import { MockResponseModel } from "@mock/core/_types";

mock({
  url: '/api/people',
  callback: (req): MockResponseModel => {
    const method = req?.method;

    if (method && method.toLowerCase() !== 'get') {
      return {
        body: `Only allow GET method`
      }
    }

    return {
      body: peopleData
    }
  }
});
