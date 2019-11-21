import { Component } from '@angular/core';
import { ProcureItemInfoComponent } from './procure-item-info';

import * as moment from 'moment';


@Component({
  selector: 'call-for-bids-item-info',
  templateUrl: './call-for-bids-item-info.html',
})
export class CallForBidsItemInfoComponent extends ProcureItemInfoComponent {

  description_expanded = false;

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return this.item['reason'] || 'קול קורא';
  }

  start_date() {
    return this.item['claim_date'] ? moment(this.item['claim_date']).format('DD/MM/YYYY hh:mm') : 'לא ידוע';
  }

  claim_date() {
    return this.item['claim_date'] ? moment(this.item['claim_date']).format('DD/MM/YYYY hh:mm') : 'לא ידוע';
  }

  alertText() {
    const lastWeek = moment().subtract(7, 'days');
    if (this.item['start_date'] &&
        moment(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    } else {
      const lastUpdateDate = this.lastUpdateDate();
      if (lastUpdateDate &&
          moment(lastUpdateDate).isAfter(lastWeek)) {
        return 'מעודכן!';
      }
    }
    return null;
  }

  lastUpdateDate() {
    if (this.item['__last_modified_at']) {
      return this.format_date(this.item['__last_modified_at']);
    }
  }

  itemTitle() {
    return this.item['page_title'];
  }

  actionables_aux() {
    const rets = this.item['actionable_tips'] || [];
    if (this.item['contact']) {
      const ret = [];
      ret.push('<b>איך פונים?</b><br/>' + this.item['contact']);
      if (this.item['contact_email']) {
        ret.push('mailto:' + this.item['contact_email']);
        ret.push('לפניה באימייל');
      }
      rets.push(ret);
    }
    return rets;
  }

  processTag() {
    return this.item['tender_type_he'] || 'קול קורא';
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

}
