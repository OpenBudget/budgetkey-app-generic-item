import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
import { format_absolute_percent, format_number } from '../../../pipes/render-template';
import { ProcureItemInfoComponent } from './procure-item-info';

@Component({
  selector: 'tender-item-info',
  template: require('./tender-item-info.html'),
})
export class TenderItemInfoComponent extends ProcureItemInfoComponent {

  statusText() {
    let decision: string = this.item['decision'];
    if (decision === 'חדש' || decision === 'עודכן') {
      return 'מכרז פתוח';
    } else if (decision === 'הסתיים' || decision === 'בתוקף') {
      return 'מכרז שנסגר';
    } else if (decision === 'בוטל') {
      return 'מכרז שבוטל';
    } else if (decision === 'עתידי') {
      return 'עתידי';
    } else if (decision === 'פורסם וממתין לתוצאות') {
      return 'פתוח';
    } else if (decision === 'לא בתוקף') {
      return 'הושלם תהליך הרכש';
    } else if (!decision) {
      return null;
    } else if (decision.indexOf('אושר ') === 0) {
      return 'הושלם תהליך הרכש';
    } else if (decision.indexOf('לא אושר ') === 0) {
      return 'לא אושר';
    } else if (decision.indexOf('התקשרות בדיעבד ') === 0) {
      return 'הושלם תהליך הרכש';
    } else if (this.item['tender_type'] === 'exemptions') {
      return 'בתהליך';
    }
    return 'N/A';
  }

  tagText() {
    let decision: string = this.item['decision'];
    if (decision === 'הסתיים' || decision === 'בתוקף') {
      let awardees = this.item['awardees'];
      if (!awardees || awardees.length == 0) {
        return 'הושלם תהליך הרכש - לא החלה התקשרות';
      } else if (awardees.length > 0) {
        for (let awardee of awardees) {
          if (awardee.active) {
            return 'הושלם תהליך הרכש - החלה התקשרות';
          }
        }
        return 'הושלם תהליך הרכש והושלמה ההתקשרות';
      }
    } else {
        return this.statusText();
    }
  }

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
    return this.item['awardees'];
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }
}
