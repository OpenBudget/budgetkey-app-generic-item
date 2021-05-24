import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

import { QuestionsManager } from '../components/questions/questions-manager';

import { Item, PreparedQuestion, PreparedQuestions, DescriptorBase } from '../model';

class Store {
  item = new Item();
  descriptor = new DescriptorBase('', '', []);
}

// Global state storage

@Injectable()
export class StoreService {

  private store = new Store();

  itemChange = new EventEmitter<Item>();
  descriptorChange = new EventEmitter<DescriptorBase>();
  questions = new QuestionsManager();

  private static processItem(item: Item): Item {
    return <Item>_.mapKeys(item, (value: any, key: string, obj: any) => {
      return key.replace(/-/g, '_');
    });
  }


  constructor() {
  }

  get item(): Item {
    return this.store.item;
  }

  set item(value: Item) {
    this.store.item = StoreService.processItem(value);
    this.itemChange.emit(this.store.item);
  }

  get descriptor(): DescriptorBase {
    return this.store.descriptor;
  }

  set descriptor(value: DescriptorBase) {
    this.store.descriptor = value;
    this.questions.preparedQuestions = this.questions.parseQuestions(
      this.descriptor.questions,
      this.store.item
    );
    this.descriptorChange.emit(this.store.descriptor);
  }

  get preparedQuestions(): PreparedQuestions {
    return this.questions.preparedQuestions;
  }

  get currentQuestion(): PreparedQuestion {
    return this.questions.currentQuestion;
  }

  get currentParameters(): object {
    return this.questions.currentParameters;
  }

  set currentParameters(value: object) {
    this.questions.currentParameters = value;
  }

  get dataQuery(): string {
    return this.questions.dataQuery(this.item);
  }

}
