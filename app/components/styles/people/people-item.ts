import { Component } from '@angular/core';

import * as _ from 'lodash';
import {BaseItemInfoComponent} from '../../base-item-info';
import {DescriptorBase} from '../../../model';
@Component({
  selector: 'people-item',
  template: require('./people-item.html')
})
export class PeopleItemComponent extends BaseItemInfoComponent  {

  private descriptor: DescriptorBase;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = this.store.descriptor;
  }
}
