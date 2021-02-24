import req from '@helperdiscord/centra';
import {
  IVelocityOptions,
  IAnalyzeCommentRequest,
  IRequestedAttributes,
  IAnalysisResults,
  IAttributeScores,
} from '../util/Types';
import stripTags from 'striptags';

export class Velocity {
  private readonly apiKey!: string;
  private apiUrl!: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.apiUrl = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${this.apiKey}`;
  }

  public async processMessage(
    message: string,
    reqOptions: IVelocityOptions = {}
  ) {
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
        // eslint-disable-next-line no-prototype-builtins
        if (attributeScores.hasOwnProperty(attribute)) {
          scoreValues[attribute] = parseFloat(
            attributeScores[attribute].summaryScore.value
          );
        }
      }
    } catch (error) {
      throw new Error(`[Velocity] ${error.message}`);
    }
  }

  private _validateString(message: string): void {
    if (message === '')
      throw new Error('[Velocity] Message provided should not be empty.');
    if (message.length > 3000)
      throw new Error(
        '[Velocity] Message provided is too long (more than 3000 characters).'
      );
  }

  private _validAttributes(attributes: string[]): boolean {
    if (!attributes.length)
      throw new Error(
        '[Velocity] Please provide at least one attribute to score.'
      );

    for (const attribute of attributes) {
      if (attribute === '' || attribute === undefined || attribute === null)
        throw new Error(`[Velocity] Invalid attribute provided: ${attribute}`);
    }

    return true;
  }

  private _buildRequestedAttributes(
    attributes: string[]
  ): IRequestedAttributes {
    const attributeObject: IRequestedAttributes = {};

    for (const attribute of attributes) {
      attributeObject[attribute] = {};
    }

    return attributeObject;
  }

  private async _analyzeMessage(
    object: IAnalyzeCommentRequest
  ): Promise<IAnalysisResults> {
    const request = await req(this.apiUrl).body(object).method('POST').send();

    return request.json();
  }
}
