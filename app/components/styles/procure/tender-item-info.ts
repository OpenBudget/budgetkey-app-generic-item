import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
import { format_absolute_percent, format_number } from '../../../pipes/render-template';
import { ProcureItemInfoComponent } from './procure-item-info';

const tooltips = require('./tooltips.json');
console.log('TOOLTIPS:', tooltips);

@Component({
  selector: 'tender-item-info',
  template: require('./tender-item-info.html'),
})
export class TenderItemInfoComponent extends ProcureItemInfoComponent {

  toText() {
    let decision: string = this.item['decision'];
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
    let lastWeek = moment().subtract(7, 'days');
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
    for (let k of Object.keys(tooltips)) {
      if (content.indexOf(k) >= 0) {
        let tooltip = `<span class='bk-tooltip-anchor'>${k}<span class='bk-tooltip'>${tooltips[k]}</span></span>`;
        content = content.replace(k, tooltip);
        break;
      }
    }
    return content;
  };

}
