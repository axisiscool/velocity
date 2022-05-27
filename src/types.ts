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
  | 'ATTACK_ON_AUTHOR'
  | 'ATTACK_ON_COMMENTER'
  | 'INCOHERENT'
  | 'INFLAMMATORY'
  | 'LIKELY_TO_REJECT'
  | 'OBSCENE'
  | 'SPAM'
  | 'UNSUBSTANTIAL';

export interface IContext {
  entries: {
    text?: string;
    type?: string;
  }[];
}

export interface IVelocityOptions {
  attributes?: TValidAttributes[];
  context?: IContext;
  doNotStore?: boolean;
  languages?: string[];
}

export interface IAttributeScores {
  [attribute: string]: number;
}

export interface IRequestedAttributes {
  [attribute: string]: {
    scoreType?: string;
    scoreThreshold?: number;
  };
}
