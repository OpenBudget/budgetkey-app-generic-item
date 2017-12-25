export class Question {
  text = '';
  query = '';
  parameters: object = {};
  defaults: object | null = {};
}

export class PreparedQuestionTextFragment {
  isText = false;
  isParameter = false;
  value = '';
}

export class PreparedQuestionParameterFragment {
  isText = false;
  isParameter = false;
  name = '';
  value = '';
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

export class Descriptor {
  pathPrefix = '';
  preTitleTemplate = '';
  titleTemplate = '';
  subtitleTemplate = '';
  textTemplate = '';
  amountTemplate = '';
  questions: Questions = [];
}
