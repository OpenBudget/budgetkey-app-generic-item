import { Component } from '@angular/core';
import { ProcureItemInfoComponent } from './procure-item-info';

import * as moment from 'moment';

const tooltips = require('./tooltips.json');

@Component({
  selector: 'call-for-bids-item-info',
  templateUrl: './call-for-bids-item-info.html',
})
export class CallForBidsItemInfoComponent extends ProcureItemInfoComponent {

  publisher() {
    return this.item['publisher'];
  }

  tenderType() {
    return this.item['reason'] || 'קול קורא';
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
    const ret = [];
    if (this.item['contact']) {
      ret.push('<b>איך פונים?</b><br/>' + this.item['contact']);
      if (this.item['contact_email']) {
        ret.push(this.item['contact_email']);
        ret.push('לפניה באימייל');
      }
    }
    return [ret];
  }

  open_document(attachment: any) {
    window.open(attachment.link, '_blank');
  }

  tooltip(content: string) {
    if (!content) {
      return content;
    }
    for (let i = 0 ; i < tooltips.length ; i++ ) {
      const k = tooltips[i][0];
      const repl = 'TTT' + i + 'PPP';
      if (content.indexOf(k) >= 0) {
        content = content.replace(k, repl);
      }
    }
    for (let i = 0 ; i < tooltips.length ; i++ ) {
      const k = 'TTT' + i + 'PPP';
      const repl = `<span class='bk-tooltip-anchor'>${tooltips[i][0]}<span class='bk-tooltip'>${tooltips[i][1]}</span></span>`;
      if (content.indexOf(k) >= 0) {
        content = content.replace(k, repl);
      }
    }
    return content;
  }

}
