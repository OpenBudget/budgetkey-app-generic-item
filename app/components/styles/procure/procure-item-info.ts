import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as _ from 'lodash';
import { BaseItemInfoComponent } from '../../base-item-info';
import { format_absolute_percent, format_number } from '../../../pipes/render-template';

@Component({
  selector: 'procure-item-info',
  template: require('./procure-item-info.html'),
})
export class ProcureItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: DescriptorBase;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = this.store.descriptor;
  }

  statusText() {
    let decision: string = this.item['decision'];
    if (decision === 'חדש' || decision === 'עודכן') {
      return 'מכרז פתוח';
    }
    return 'N/A';
  }

  tenderType() {
    return {
      office: 'מכרז משרדי',
      central: 'מכרז מרכזי',
      exemption: 'בקשת פטור ממכרז',
    }[this.item['tender_type']];
  }

  // Formatting
  percent(x: number) {
    return format_absolute_percent(x);
  }

  number(x: number) {
    return format_number(x);
  }  
}
