# 💨 Velocity

A super fast API Wrapper for Perspective.

### Requirements
* Node >= 12
* Perspective API Access

### Installation

Install using one of these commands (depending on your package manager):
```
npm i velocity-api
pnpm i velocity-api
yarn add velocity-api
```

### Example Usage

* Note: This is a basic usage guide.

#### Typescript:
```ts
import { Velocity } from 'velocity-api';

(async () => {
  const manager = new Velocity('PERSPECTIVE_API_KEY');

  const scores = await manager.processMessage('I don\'t like you!', {
    attributes: ['SPAM', 'SEVERE_TOXICITY'],
    languages: ['en'],
    doNotStore: true,
    stripHtml: false,
  });

  // The returned value is an object of the attributes and their score.
  console.log(scores.SPAM);
  console.log(scores.SEVERE_TOXICITY);
})();
```

#### Javascript:
```js
const { Velocity } = require('velocity-api');

(async () => {
  const manager = new Velocity('PERSPECTIVE_API_KEY');

  const scores = await manager.processMessage('I don\'t like you!', {
    attributes: ['SPAM', 'SEVERE_TOXICITY'],
    languages: ['en'],
    doNotStore: true,
    stripHtml: false,
  });

  // The returned value is an object of the attributes and their score.
  console.log(scores.SPAM);
  console.log(scores.SEVERE_TOXICITY);
})();
```

### License

This repository is licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0.txt).
