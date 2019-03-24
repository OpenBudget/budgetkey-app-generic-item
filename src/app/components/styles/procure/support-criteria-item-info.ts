import { Component } from '@angular/core';
import { ProcureItemInfoComponent } from './procure-item-info';

import * as moment from 'moment';

@Component({
  selector: 'support-criteria-item-info',
  templateUrl: './support-criteria-item-info.html',
})
export class SupportCriteriaItemInfoComponent extends ProcureItemInfoComponent {


  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return this.item['reason'] || 'מבחני תמיכה';
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
      return moment(this.item['__last_modified_at']).format('YYYY-MM-DD');
    }
  }

  itemTitle() {
    return this.item['page_title'];
  }

  actionables() {
    const rets = [];
    if (this.item['contact']) {
      const ret = [];
      ret.push('<b>איך פונים?</b><br/>' + this.item['contact']);
      if (this.item['contact_email']) {
        ret.push(this.item['contact_email']);
        ret.push('לפניה באימייל');
      }
      rets.push(ret);
    }
    return rets;
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

}
