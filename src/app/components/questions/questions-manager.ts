import { EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Subject } from 'rxjs';
import { BudgetKeyItemService, StoreService } from 'src/app/services';

import {
    Question, Questions,
    PreparedQuestion, PreparedQuestions
  } from '../../model';
  

export class QuestionsManager {

    _preparedQuestions: PreparedQuestions | null = null;
    _currentQuestion: PreparedQuestion | null = null;
    _currentParameters: object | null = null;
  
    preparedQuestionsChange = new BehaviorSubject(null);
    dataQueryChange = new BehaviorSubject(null);
    dataReady = new BehaviorSubject<{headers, data, err?}>({headers: [], data: []});

    loading = false;
    total: number = 0;
  
    constructor(private store: StoreService, private itemService: BudgetKeyItemService) {}

    set preparedQuestions(value) {
        this._preparedQuestions = value;
        if (value) {
            this.currentQuestion = this.currentQuestion || value[0];
        }
    }

    get preparedQuestions() {
        return this._preparedQuestions;
    }

    set currentQuestion(value: PreparedQuestion) {
        if (value !== this._currentQuestion) {
            this._currentQuestion = value;
            if (value) {
              this.currentParameters = value.defaults;
            }
        }
    }

    get currentQuestion() {
        return this._currentQuestion;
    } 

    get currentParameters(): object {
        return this._currentParameters;
    }
    
    set currentParameters(value: object) {
        this._currentParameters = value;
        
        this.doQuery();
        // this.dataQueryChange.next(null);    
    }
    
    get dataQuery(): string {
        const parameters = {};
        const context = this.store.item || {};
        _.each(this._currentParameters, (value, key) => {
          parameters[key] = this.currentQuestion.parameters[key][value];
        });
        const query = this.formatQuery(this.currentQuestion.query, parameters);
        return this.formatQuery(query, context);
    }
    
    doQuery() {
        if (!this.currentQuestion) {
            return;
          }
          this.total = 0;
          this.loading = true;
          this.dataReady.next({headers: [], data: []});
          const headersOrder = Array.from(this.currentQuestion.headers);
          const formatters = this.currentQuestion.formatters;
          this.itemService.getItemData(this.dataQuery, headersOrder, formatters)
            .subscribe({
              next: (data: any) => {
                if (data && data.query === this.dataQuery) {
                  this.total = data.total;
                  this.loading = false;
                  this.dataReady.next({headers: data.headers, data: data.items});
                }
              },
              error: (err) => {
                console.log('err', err);
                this.total = 0;
                this.loading = false;
                this.dataReady.next({headers: [], data: [], err});
              }
        });
    }

    formatQuery(query: string | string[], parameters: object): string {
        // TODO: Escape parameters (needs to be discussed)
        if (query instanceof Array) {
            query = (<string[]>query).join(' ');
        }
        return (<string>query).replace(/:([a-z][a-z0-9_.]*)/ig, (match, name) => {
            return _.get(parameters, name) ? _.get(parameters, name) : match;
        });
    }
    
    parseQuestions(questions: Questions, parameters: object): PreparedQuestions {
    return _.map(questions, (question: Question) => {
        const result = new PreparedQuestion();
        if (_.isArray(question.query)) {
        question.query = (<string[]>question.query).join(' ');
        }
        _.extend(result, question);

        let s = this.formatQuery(question.text, parameters);
        const parsed = [];
        let lastText: any = null;
        while (true) {
        const pattern = /<([a-z0-9-_]+)>/ig;
        const match = pattern.exec(s);
        if (match === null) {
            break;
        }
        const name = match[1];
        if (question.parameters.hasOwnProperty(name)) {
            if (_.values(question.parameters[name]).length > 0) {
            const fragment = s.substr(0, match.index);
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
            const fragment = s.substr(0, match.index + match[0].length);
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