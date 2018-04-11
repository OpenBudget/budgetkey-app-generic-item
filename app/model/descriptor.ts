export class Question {
  text: string = '';
  query: string | string[] = '';
  parameters: object = {};
  defaults: object | null = {};
  headers: string[] | null = [];
  formatters: object | null = {};
}

export class PreparedQuestionTextFragment {
  isText: boolean = false;
  isParameter: boolean = false;
  value: string = '';
}

export class PreparedQuestionParameterFragment {
  isText: boolean = false;
  isParameter: boolean = false;
  name: string = '';
  value: string = '';
  values: object = {};
}

export type PreparedQuestionFragment = PreparedQuestionTextFragment | PreparedQuestionParameterFragment;
export type PreparedQuestionFragments = PreparedQuestionFragment[];

export class PreparedQuestion extends Question {
  parsed: PreparedQuestionFragments = [];
  defaults: object = {};  // key-value pairs of default values for each parameter
}

export type Questions = Question[];
export type PreparedQuestions = PreparedQuestion[];

export class DescriptorBase {
  visualizationTemplates: any;
  pathPrefix: string;
  style: string;
  questions: Questions;

  constructor(pathPrefix: string,
              style: string,
              questions: Questions,
              visualizationTemplates?: any) {
    this.pathPrefix = pathPrefix;
    this.style = style;
    this.questions = questions;
    this.visualizationTemplates = visualizationTemplates || {};
  }
}

export class SimpleDescriptor extends DescriptorBase {
  preTitleTemplate: string = '';
  titleTemplate: string = '';
  subtitleTemplate: string = '';
  textTemplate: string = '';
  amountTemplate: string = '';

  constructor(x: any, style?: string) {
    super(x.pathPrefix, style || 'simple', x.questions, x.visualizationTemplates);
    this.preTitleTemplate = x.preTitleTemplate;
    this.titleTemplate = x.titleTemplate;
    this.subtitleTemplate = x.subtitleTemplate;
    this.textTemplate = x.textTemplate;
    this.amountTemplate = x.amountTemplate;
  }
}

export class Indicator {
  asset: string;
  template: string;

  constructor(asset: string, template: string) {
    this.asset = asset;
    this.template = template;
  }
}

export class ReportDescriptor extends DescriptorBase {
  indicators: Indicator[] = [];
  titleTemplate: string = '';
  suffixTemplate: string = '';

  constructor(x: any) {
    super(x.pathPrefix, 'report', x.questions);
    this.indicators = x.indicators;
    this.suffixTemplate = x.suffixTemplate;
    this.titleTemplate = x.titleTemplate;
  }
}
