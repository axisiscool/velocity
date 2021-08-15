const fetch = require('petitio');

class Velocity {
  #key;
  constructor(key) {
    this.#key = key;
  }

  /**
   * Processes a string (with optional paramters) and returns the scores for the specified request.
   * @param message {string} The string you want to process.
   * @param options {any} Options for the request.
   */
  async processMessage(message, options) {
    const {
      attributes = ['SPAM', 'TOXICITY'],
      context,
      doNotStore = true,
      languages = ['en'],
    } = options;

    this.#validateString(message);
    this.#validateAttributes(attributes);

    const request = {
      comment: {
        text: message,
      },
      context,
      doNotStore,
      languages,
      requestedAttributes: this.#buildAttributes(attributes),
    };

    try {
      const response = await this.#analyzeMessage(request);
      const scoreVals = Object.create(null);

      const keys = Object.keys(response.attributeScores);
      for (var i = 0; i !== keys.length; ++i) {
        const k = keys[i];
        if (response.attributeScores[k])
          scoreVals[k] = Number.parseFloat(
            response.attributeScores[k].summaryScore.value
          );
      }

      return scoreVals;
    } catch (ex) {
      throw new Error(ex);
    }
  }

  /**
   * Validates the string provided to the processMessage() function.
   * @param message The string we want to validate.
   */
  #validateString(message) {
    switch (true) {
      case message.length === 0:
        throw new Error('Message provided should not be empty');
      case message.length > 3000:
        throw new Error('Message should be under 3,000 characters.');
    }
  }

  /**
   * Validates the attributes provided to the processMessage() function.
   * @param attributes An array of attributes we want to provide to the API.
   */
  #validateAttributes(attributes) {
    if (attributes.length < 1)
      throw new Error('Please provide at least one attribute to score.');
    for (var i = 0; i !== attributes.length; ++i) {
      const k = attributes[i];
      if (k === undefined) throw new Error(`Invalid attribute provided: ${k}`);
    }
  }

  /**
   * Builds the validated attributes.
   * @param attributes An array of attributes we want to provide to the API.
   */
  #buildAttributes(attributes) {
    const attrObj = Object.create(null);
    for (var i = 0; i !== attributes.length; ++i)
      attrObj[attributes[i]] = Object.create(null);
    return attrObj;
  }

  /**
   * The actual function which processes the message and returns the object back.
   * @param object The actual request provided by the processMessage() function.
   */
  async #analyzeMessage(object) {
    return fetch(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
      'POST'
    )
      .body(object)
      .query('key', this.#key)
      .json();
  }
}

module.exports = { Velocity };
