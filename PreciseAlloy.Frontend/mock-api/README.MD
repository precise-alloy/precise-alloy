# Mock Fetch

Mock http request made using [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Structure

- **mock-api**
  - **core**: Include core functions
    - **_types.d.ts**: Declare typed for ts
    - **event.ts**: EventCenter constructor, listener and dispatch event
    - **fetch.ts**: Custom fetch
    - **mock.ts**: Declare http request through the function
  - **request**: Include all requests
- **...(another folders)**

## Usage

- Only support from origin: window.location.origin
- Only support from url start with '/api'
- Fall back to default fetch when the conditions are not matched

**Example**: You want to create a GET request for the url '/api/avatar'.

Create an **avatar** folder below the **request** folder, create a 'index.ts' file and a 'data.ts' file below this folder:

- **mock-api**
  - **request**
    - avatar
      - data.ts
      - index.ts

index.ts file is required file, and you can create a mock on the file, copy and paste following:

```jsx
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
```

**NOTE: always use import from @mock, avoid import relative like that:**

```jsx
import { avatarData } from "./data";
```

Create data json for the url, copy and paste following:

```jsx
import { AvatarModel } from "@_types/organisms";

export const avatarData: AvatarModel[] = [
  {
    name: "Peg Legge",
    image: {
      src: "/samples/peg-legge.svg",
      width: '175',
      height: '175',
      alt: 'people 1'
    },
    jobTitle: "CEO"
  },
  {
    name: "Richard Guerra",
    image: {
      src: "/samples/richard-guerra.svg",
      width: '175',
      height: '175',
      alt: 'people 2'
    },
    jobTitle: "CEO"
  },
  {
    name: "Alexandra Stolz",
    image: {
      src: "/samples/alexandra-stolz.svg",
      width: '175',
      height: '175',
      alt: 'people 3'
    },
    jobTitle: "CEO"
  },
  {
    name: "Janet Bray",
    image: {
      src: "/samples/janet-bray.svg",
      width: '175',
      height: '175',
      alt: 'people 4'
    },
    jobTitle: "CEO"
  },
]
```

Finally, call the request with fetch and you will get the data above:

```js
fetch('/api/avatar').then(res => res.json()).then(console.log)
```

Have fun!
