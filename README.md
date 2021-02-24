# 💨 Velocity

A super fast API Wrapper for Perspective.

### Installation

Run: `npm i velocity-api` in your project.

### Example Usage

```ts
import {Velocity} from 'velocity-api';
// OR in JavaScript
const {Velocity} = require('velocity-api');

// Instantiate the Velocity class below.
const velocity = new Velocity('API_KEY');

// Then, proceed to run the function to process your scores.
(async () => {
    const scores = await velocity.processMessage('I hate people.', { 
        'context.entries': null, // A list of objects providing the context for text. Defaults to null, equivalent to an empty list.
    
        attributes: ['SPAM', 'TOXICITY'], // https://support.perspectiveapi.com/s/about-the-api-attributes-and-languages

        languages: ['en'], // A list of ISO 631-1 two-letter language codes specifying the language(s) that message is in (for example, "en", "es", "fr", etc). Default: ["EN"]

        doNotStore: true, // Whether the API is permitted to store the text and context.

        stripHtml: true // A boolean specifying whether to strip html tags from message.
    });

    console.log(scores.SPAM) // SPAM: 0.25
    console.log(scores.TOXICITY) // TOXICITY: 0.65
})();
```

### License

This repository is licensed under the `Apache 2.0 License`
