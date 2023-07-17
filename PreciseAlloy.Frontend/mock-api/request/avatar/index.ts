import mock from "@mock/core/mock";
import { avatarData } from "@mock/request/avatar/data";
import { MockResponseModel } from "@mock/core/_types";

mock({
  url: '/api/avatar',
  callback: (req): MockResponseModel => {
    const method = req?.method;

    if (method && method.toLowerCase() !== 'get') {
      return {
        body: `Only allow GET method`
      }
    }

    return {
      body: avatarData
    }
  }
});
