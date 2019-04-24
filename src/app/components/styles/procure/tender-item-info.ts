import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
import { ProcureItemInfoComponent } from './procure-item-info';

const tooltips = require('./tooltips.json');

@Component({
  selector: 'tender-item-info',
  templateUrl: './tender-item-info.html',
})
export class TenderItemInfoComponent extends ProcureItemInfoComponent {

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return {
      office: 'מכרז משרדי',
      central: 'מכרז מרכזי',
      exemption: 'בקשת פטור ממכרז',
    }[this.item['tender_type']];
  }

  alertText() {
    const lastWeek = moment().subtract(7, 'days');
    if (this.item['start_date'] &&
        moment(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    }
    if (this.item['last_update_date'] &&
        moment(this.item['last_update_date']).isAfter(lastWeek)) {
      return 'עודכן!';
    }
    return null;
  }

  lastUpdateDate() {
    if (this.item['last_update_date']) {
      return this.format_date(this.item['last_update_date']);
    }
    if (this.item['__last_modified_at']) {
      return this.format_date(this.item['__last_modified_at']);
    }
  }

  itemTitle() {
    if (this.item['tender_kind'] === 'central') {
      return this.item['page_title'];
    }
    return this.item['description'];
  }

  totalAmount() {
    return this.item['contract_volume'] || this.item['volume'];
  }

  totalPaid() {
    return this.item['contract_executed'];
  }

  actionables_aux() {
    return this.item['actionable_tips'];
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

}
