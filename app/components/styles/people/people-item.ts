import {Component} from '@angular/core';

import * as moment from 'moment';

import {BaseItemInfoComponent} from '../../base-item-info';
import {DescriptorBase} from '../../../model';

@Component({
  selector: 'people-item',
  template: require('./people-item.html')
})
export class PeopleItemComponent extends BaseItemInfoComponent  {

  private descriptor: DescriptorBase;

  format_date(txt: string) {
    return moment(txt, 'YYYY-MM-DD').format('DD-MM-YYYY');
  }
  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = this.store.descriptor;
  }
}
