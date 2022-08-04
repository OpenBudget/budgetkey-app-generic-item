import { QuestionParser } from './question-parser';
import { Questions } from './questions';

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

  public init(themeId: string) {
    QuestionParser.processQuestions(this.questions, themeId);
  }
}

export class SimpleDescriptor extends DescriptorBase {
  preTitleTemplate = '';
  titleTemplate = '';
  subtitleTemplate = '';
  textTemplate = '';
  amountTemplate = '';

  constructor(x: any, style?: string) {
    super(x.pathPrefix, style || 'simple', x.questions, x.visualizationTemplates);
    this.preTitleTemplate = x.preTitleTemplate;
    this.titleTemplate = x.titleTemplate;
    this.subtitleTemplate = x.subtitleTemplate;
    this.textTemplate = x.textTemplate;
    this.amountTemplate = x.amountTemplate;
  }
}

export class OrgDescriptor extends SimpleDescriptor {
  tips: string[] = [];

  constructor(x: any) {
    super(x, 'org');
    this.tips = x.tips;
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
  titlePrefix = '';
  titleSuffix = '';
  titleField = '';
  titleOtherURLPrefix = '';
  suffixTemplate = '';

  constructor(x: any) {
    super(x.pathPrefix, 'report', x.questions);
    this.indicators = x.indicators;
    this.suffixTemplate = x.suffixTemplate;
    this.titlePrefix = x.titlePrefix;
    this.titleSuffix = x.titleSuffix;
    this.titleField = x.titleField;
    this.titleOtherURLPrefix = x.titleOtherURLPrefix;
  }
}

export class ProcureDescriptor extends DescriptorBase {
  constructor(x: any) {
    super(x.pathPrefix, 'procure', x.questions);
  }
}

export class PeopleDescriptor extends DescriptorBase {
  constructor(x: any) {
    super(x.pathPrefix, 'people', x.questions);
  }
}

export class GovUnitDescriptor extends SimpleDescriptor {
  constructor(x: any) {
    super(x, 'gov_unit');
  }
}

export class SocialServiceDescriptor extends SimpleDescriptor {
  constructor(x: any) {
    super(x, 'social_service');
  }
}

export class MuniDescriptor extends SimpleDescriptor {
  constructor(x: any) {
    super(x, 'muni');
  }
}
export class MuniBudgetDescriptor extends SimpleDescriptor {
  constructor(x: any) {
    super(x, 'muni_budget');
  }
}
