import fetch from 'petitio';
import type {
  IAttributeScores,
  IRequestedAttributes,
  IVelocityOptions,
  TValidAttributes,
} from './types';

export class Velocity {
  #key: string;

  constructor(key: string) {
    this.#key = key;
  }

  /**
   * Processes a string (with optional paramters) and returns the scores for the specified request.
   * @param {string} message The string you want to process.
   * @param {IVelocityOptions} options Options for the request.
   */
  async processMessage(message: string, options: IVelocityOptions) {
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
      const scoreVals: IAttributeScores = {};

      const keys = Object.keys(response.attributeScores);
      for (var i = 0; i !== keys.length; ++i) {
        const k = keys[i];
        if (response.attributeScores[k])
          scoreVals[k] = Number.parseFloat(
            response.attributeScores[k].summaryScore.value
          );
      }

      return scoreVals;
    } catch (ex: any) {
      throw new Error(ex);
    }
  }

  /**
   * Validates the string provided to the processMessage() function.
   * @param {string} message The string we want to validate.
   */
  #validateString(message: string) {
    switch (true) {
      case message.length === 0:
        throw new Error('Message provided should not be empty');
      case message.length > 20480:
        throw new Error('Message should be under 20,480 characters.');
    }
  }

  /**
   * Validates the attributes provided to the processMessage() function.
   * @param {TValidAttributes[]} attributes An array of attributes we want to provide to the API.
   */
  #validateAttributes(attributes: TValidAttributes[]) {
    if (attributes.length < 1)
      throw new Error('Please provide at least one attribute to score.');
    for (var i = 0; i !== attributes.length; ++i) {
      const k = attributes[i];
      if (k === undefined) throw new Error(`Invalid attribute provided: ${k}`);
    }
  }

  /**
   * Builds the validated attributes.
   * @param {TValidAttributes[]} attributes An array of attributes we want to provide to the API.
   */
  #buildAttributes(attributes: TValidAttributes[]) {
    const attrObj: IRequestedAttributes = {};
    for (var i = 0; i !== attributes.length; ++i) attrObj[attributes[i]] = {};
    return attrObj;
  }

  /**
   * The actual function which processes the message and returns the object back.
   * @param {IVelocityOptions} object The actual request provided by the processMessage() function.
   */
  async #analyzeMessage(object: IVelocityOptions) {
    return fetch(
      'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
      'POST'
    )
      .body(object)
      .query('key', this.#key)
      .json();
  }
}
