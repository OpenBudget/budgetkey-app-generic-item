export class Question {
    text: string;
    query: string | string[];
    parameters: object = {};
    defaults: object | null = {};
    headers: string[];
    formatters: any[] = [];
    originalHeaders: string[] | null;
    graphFormatter: string;
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
