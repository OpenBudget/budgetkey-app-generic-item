import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
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
    } else if (decision === 'הסתיים') {
      return 'מכרז שנסגר';
    } else if (decision === 'בוטל') {
      return 'מכרז שבוטל';
    }
    return 'N/A';
  }

  toText() {
    let decision: string = this.item['decision'];
    if (decision === 'בוטל') {
      return 'המכרז בוטל';
    }
  }

  tenderType() {
    return {
      office: 'מכרז משרדי',
      central: 'מכרז מרכזי',
      exemption: 'בקשת פטור ממכרז',
    }[this.item['tender_type']];
  }

  alertText() {
    let lastWeek = moment().subtract(7, 'days');
    if (moment(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    }
    if (moment(this.item['last_update_date']).isAfter(lastWeek)) {
      return 'עודכן!';
    }
    return null;
  }

  // Formatting
  percent(x: number) {
    return format_absolute_percent(x);
  }

  number(x: number) {
    return format_number(x);
  }

  relative(x: string) {
    return '<span title="' + x + '">' + moment(x).fromNow() + '</span>';
  }
}
