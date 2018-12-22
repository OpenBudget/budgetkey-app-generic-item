import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import {
  Question, Questions,
  PreparedQuestion, PreparedQuestions
} from '../model';

@Injectable()
export class QuestionsService {

  formatQuery(query: string | string[], parameters: object): string {
    // TODO: Escape parameters (needs to be discussed)
    if (_.isArray(query)) {
      query = (<string[]>query).join(' ');
    }
    return (<string>query).replace(/:([a-z][a-z0-9_.]*)/ig, (match, name) => {
      return _.get(parameters, name) ? _.get(parameters, name) : match;
    });
  }

  parseQuestions(questions: Questions, parameters: object): PreparedQuestions {
    return _.map(questions, (question: Question) => {
      let result = new PreparedQuestion();
      if (_.isArray(question.query)) {
        question.query = (<string[]>question.query).join(' ');
      }
      _.extend(result, question);

      let s = this.formatQuery(question.text, parameters);
      let parsed = [];
      let lastText: any = null;
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
              if (lastText) {
                lastText.value += fragment;
                lastText = null;
              } else {
                parsed.push({
                  isText: true,
                  isParameter: false,
                  value: fragment
                });
              }
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
        } else {
          let fragment = s.substr(0, match.index + match[0].length);
          if (fragment !== '') {
            if (lastText) {
              lastText.value += fragment;
            } else {
              lastText = {
                isText: true,
                isParameter: false,
                value: fragment
              };
              parsed.push(lastText);
            }
          }
          s = s.substr(match.index + match[0].length);
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
}
