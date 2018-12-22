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

  toText() {
    const decision: string = this.item['decision'];
    if (decision) {
      if (decision === 'בוטל') {
        return 'המכרז בוטל';
      }
    }
    if (!this.item['awardees'] || this.item['awardees'].length === 0) {
      if (this.item['entity_name']) {
        return this.item['entity_name'];
      } else if (this.item['supplier']) {
        return this.item['supplier'];
      }
    }
  }

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
      return this.item['last_update_date'];
    }
    if (this.item['__last_modified_at']) {
      return moment(this.item['__last_modified_at']).format('YYYY-MM-DD');
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

  actionables() {
    return this.item['actionable_tips'];
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

  tooltip(content: string) {
    if (!content) {
      return content;
    }
    for (let i = 0 ; i < tooltips.length ; i++ ) {
      let k = tooltips[i][0];
      let repl = 'TTT' + i + 'PPP';
      if (content.indexOf(k) >= 0) {
        content = content.replace(k, repl);
      }
    }
    for (let i = 0 ; i < tooltips.length ; i++ ) {
      let k = 'TTT' + i + 'PPP';
      let repl = `<span class='bk-tooltip-anchor'>${tooltips[i][0]}<span class='bk-tooltip'>${tooltips[i][1]}</span></span>`;
      if (content.indexOf(k) >= 0) {
        content = content.replace(k, repl);
      }
    }
    return content;
  };

}
