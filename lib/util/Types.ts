export interface IVelocityOptions {
  attributes?: string[];
  context?: IContext;
  doNotStore?: boolean;
  languages?: string[];
  stripHtml?: boolean;
}

export interface IContext {
  entries: Array<{
    text?: string;
    type?: string;
  }>;
}

export interface IRequestedAttributes {
  [attribute: string]: {
    scoreType?: string;
    scoreThreshold?: number;
  };
}

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

export interface IAnalysisResults {
  attributeScores: {
    [attribute: string]: {
      summaryScore: {
        value: string;
      };
    };
  };
}

export interface IAttributeScores {
  [attribute: string]: number;
}
