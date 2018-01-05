import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import {
  Question, Questions,
  PreparedQuestion, PreparedQuestions
} from '../model';

@Injectable()
export class QuestionsService {
  parseQuestions(questions: Questions): PreparedQuestions {
    return _.map(questions, function(question: Question) {
      let result = new PreparedQuestion();
      if (_.isArray(question.query)) {
        question.query = question.query.join(' ');
      }
      _.extend(result, question);

      let s = question.text;
      let parsed = [];
      while (true) {
        let pattern = /<([a-z0-9-_]+)>/ig;
        let match = pattern.exec(s);
        if (match === null) {
          break;
        }
        let name = match[1];
        if (question.parameters.hasOwnProperty(name)) {
          if (_.values(question.parameters[name]).length > 0) {
            let fragment = s.substr(0, match.index);
            if (fragment !== '') {
              parsed.push({
                isText: true,
                isParameter: false,
                value: fragment
              });
            }
            parsed.push({
              isText: false,
              isParameter: true,
              name: name,
              value: question.defaults ? question.defaults[name] : _.first(_.keys(question.parameters[name])),
              values: question.parameters[name]
            });
            s = s.substr(match.index + match[0].length);
          }
        }
      }
      if (s !== '') {
        parsed.push({
          isText: true,
          isParameter: false,
          value: s
        });
      }

      result.parsed = parsed;
      result.defaults = _.chain(parsed)
        .filter(item => item.isParameter)
        .map((item: any) => [item.name, item.value])
        .fromPairs()
        .extend(question.defaults)
        .value();
      return result;
    });
  }

  formatQuery(query: string, parameters: object): string {
    // TODO: Escape parameters (needs to be discussed)
    return query.replace(/:([a-z][a-z0-9_]*)/ig, (match, name) => {
      return parameters.hasOwnProperty(name) ? parameters[name] : match;
    });
  }
}
