/**
 * Type for valid attributes for the API.
 */
export type TValidAttributes =
  | 'TOXICITY'
  | 'TOXICITY_EXPERIMENTAL'
  | 'SEVERE_TOXICITY'
  | 'SEVERE_TOXICITY_EXPERIMENTAL'
  | 'TOXICITY_FAST'
  | 'IDENTITY_ATTACK'
  | 'IDENTITY_ATTACK_EXPERIMENTAL'
  | 'INSULT'
  | 'INSULT_EXPERIMENTAL'
  | 'PROFANITY'
  | 'PROFANITY_EXPERIMENTAL'
  | 'THREAT'
  | 'THREAT_EXPERIMENTAL'
  | 'SEXUALLY_EXPLICIT'
  | 'FLIRTATION'
  // NYT
  | 'ATTACK_ON_AUTHOR'
  | 'ATTACK_ON_COMMENTER'
  | 'INCOHERENT'
  | 'INFLAMMATORY'
  | 'LIKELY_TO_REJECT'
  | 'OBSCENE'
  | 'SPAM'
  | 'UNSUBSTANTIAL';

/**
 * Options to provide to the processMessage() function.
 */
export interface IVelocityOptions {
  attributes?: TValidAttributes[];
  context?: IContext;
  doNotStore?: boolean;
  languages?: string[];
  stripHtml?: boolean;
}

/**
 * Optional object to provide to the request for context.
 */
export interface IContext {
  entries: Array<{
    text?: string;
    type?: string;
  }>;
}

/**
 * Model for requested attributes.
 */
export interface IRequestedAttributes {
  [attribute: string]: {
    scoreType?: string;
    scoreThreshold?: number;
  };
}

/**
 * Model for requests to the API.
 */
export interface IAnalyzeCommentRequest {
  comment: {
    text: string;
    type?: string;
  };
  requestedAttributes: IRequestedAttributes;
  context?: IContext;
  languages?: string[];
  clientToken?: string;
  doNotStore?: boolean;
}

/**
 * Returned results from the API.
 */
export interface IAnalysisResults {
  attributeScores: {
    [attribute: string]: {
      summaryScore: {
        value: string;
      };
    };
  };
}

/**
 * Returned scores parsed from IAnalysisResults.
 */
export interface IAttributeScores {
  [attribute: string]: number;
}
