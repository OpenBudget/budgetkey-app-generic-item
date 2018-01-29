import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { QuestionsService } from './questions';

import { Item, Descriptor, PreparedQuestion, PreparedQuestions } from '../model';

class Store {
  item = new Item();
  descriptor = new Descriptor();
  preparedQuestions: PreparedQuestions | null = null;
  currentQuestion: PreparedQuestion | null = null;
  currentParameters: object | null = null;
}

// Global state storage

@Injectable()
export class StoreService {

  private store = new Store();

  itemChange = new EventEmitter<Item>();
  descriptorChange = new EventEmitter<Descriptor>();
  preparedQuestionsChange = new EventEmitter();
  dataQueryChange = new EventEmitter();
  onDataReceived = new EventEmitter();

  constructor(private questionsService: QuestionsService) {
  }

  get item(): Item {
    return this.store.item;
  }
  set item(value: Item) {
    this.store.item = value;
    this.itemChange.emit(this.store.item);
    this.dataQueryChange.emit();
  }

  get descriptor(): Descriptor {
    return this.store.descriptor;
  }
  set descriptor(value: Descriptor) {
    this.store.descriptor = value;
    this.store.preparedQuestions = null;
    this.currentQuestion = null;
    this.descriptorChange.emit(this.store.descriptor);
    this.preparedQuestionsChange.emit();
    this.dataQueryChange.emit();
  }

  get preparedQuestions(): PreparedQuestions {
    if (this.store.preparedQuestions === null) {
      this.store.preparedQuestions = this.questionsService.parseQuestions(
        this.descriptor.questions);
    }
    return this.store.preparedQuestions;
  }

  get currentQuestion(): PreparedQuestion {
    return this.store.currentQuestion || _.first(this.preparedQuestions);
  }

  set currentQuestion(value: PreparedQuestion) {
    this.store.currentQuestion = value;
    if (value) {
      this.store.currentParameters = value.defaults;
    }
    this.dataQueryChange.emit();
  }

  get currentParameters(): object {
    return this.store.currentParameters || this.currentQuestion.defaults;
  }

  set currentParameters(value: object) {
    this.store.currentParameters = value;
    this.dataQueryChange.emit();
  }

  get dataQuery(): string {
    let parameters = {};
    _.each(this.currentParameters, (value, key) => {
      parameters[key] = this.currentQuestion.parameters[key][value];
    });
    return this.questionsService.formatQuery(
      this.currentQuestion.query,
      _.extend({}, this.item, parameters)
    );
  }

}
