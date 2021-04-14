import req from 'petitio';
import {
  IVelocityOptions,
  IAnalyzeCommentRequest,
  IRequestedAttributes,
  IAnalysisResults,
  IAttributeScores,
  TValidAttributes,
} from '../util/Types';
import stripTags from 'striptags';

export class Velocity {
  private readonly apiKey!: string;
  private apiUrl!: string;

  constructor(apiKey: string) {
    // Register the API key and provide it to the base URL for requests.
    this.apiKey = apiKey;
    this.apiUrl = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.apiKey}`;
  }

  /**
   * Processes a string (with optional paramters) and returns the scores for the specified request.
   * @param message The string you want to process.
   * @param reqOptions Options for the request.
   * @returns IAttributeScores
   */
  public async processMessage(
    message: string,
    reqOptions: IVelocityOptions = {}
  ): Promise<IAttributeScores> {
    const {
      attributes = ['SPAM', 'TOXICITY'],
      context,
      doNotStore = true,
      languages = ['en'],
      stripHtml = true,
    } = reqOptions;

    this._validateString(message);
    this._validAttributes(attributes);

    const request: IAnalyzeCommentRequest = {
      comment: {
        text: stripHtml ? stripTags(message) : message,
      },
      context,
      doNotStore,
      languages,
      requestedAttributes: this._buildRequestedAttributes(attributes),
    };

    try {
      const response = await this._analyzeMessage(request);
      const {attributeScores} = response;
      const scoreValues: IAttributeScores = {};

      for (const attribute in attributeScores) {
        if (attributeScores[attribute]) {
          scoreValues[attribute] = parseFloat(
            attributeScores[attribute].summaryScore.value
          );
        }
      }

      return scoreValues;
    } catch (error) {
      throw new Error(`[Velocity] ${error.message}`);
    }
  }

  /**
   * Validates the string provided to the processMessage() function.
   * @param message The string we want to validate.
   */
  private _validateString(message: string): void {
    if (message === '')
      throw new Error('[Velocity] Message provided should not be empty.');
    if (message.length > 3000)
      throw new Error(
        '[Velocity] Message provided is too long (more than 3000 characters).'
      );
  }

  /**
   * Validates the attributes provided to the processMessage() function.
   * @param attributes An array of attributes we want to provide to the API.
   * @returns boolean
   */
  private _validAttributes(attributes: TValidAttributes[]): boolean {
    if (!attributes.length)
      throw new Error(
        '[Velocity] Please provide at least one attribute to score.'
      );

    for (const attribute of attributes) {
      if (!attribute || attribute === undefined || attribute === null)
        throw new Error(`[Velocity] Invalid attribute provided: ${attribute}`);
    }

    return true;
  }

  /**
   * Builds the validated attributes.
   * @param attributes An array of attributes we want to provide to the API.
   * @returns IRequestedAttributes
   */
  private _buildRequestedAttributes(
    attributes: TValidAttributes[]
  ): IRequestedAttributes {
    const attributeObject: IRequestedAttributes = {};

    for (const attribute of attributes) {
      attributeObject[attribute] = {};
    }

    return attributeObject;
  }

  /**
   * The actual function which processes the message and returns the object back.
   * @param object The actual request provided by the processMessage() function.
   * @returns IAnalysisResults
   */
  private async _analyzeMessage(
    object: IAnalyzeCommentRequest
  ): Promise<IAnalysisResults> {
    return await req(this.apiUrl)
      .body(object)
      .method('POST')
      .json<IAnalysisResults>();
  }
}
