import { Component } from '@angular/core';
import { DescriptorBase } from '../../../model';

import * as moment from 'moment';
import { BaseItemInfoComponent } from '../../base-item-info';
import { format_absolute_percent, format_number } from '../../../pipes/render-template';

const tooltips = require('./tooltips.json');


export class ProcureItemInfoComponent extends BaseItemInfoComponent {

  private descriptor: DescriptorBase;

  private FORMAT_STR = 'DD/MM/YYYY';

  format_date(s) {
    return moment(s).format(this.FORMAT_STR);
  }

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = this.store.descriptor;
  }

  firstUpdateDate() {
    if (this.item['start_date']) {
      return this.format_date(this.item['start_date']);
    }
    if (this.item['order_date']) {
      return this.format_date(this.item['order_date']);
    }
    if (this.item['payments']) {
      return this.item['payments'][0]['date'];
    }
    if (this.item['__created_at']) {
      return this.format_date(this.item['__created_at']);
    }
  }

  // Formatting
  percent(x: number) {
    return format_absolute_percent(x);
  }

  number(x: number) {
    return format_number(x);
  }

  relative(x: string) {
    if (x) {
      return '<span title="' + x + '">' + moment(x).fromNow() + '</span>';
    }
    return 'תאריך פרסום לא ידוע';
  }

  entityLink(awardee: any) {
    const ret = '/i/org/' + awardee.entity_kind + '/' + awardee.entity_id;
    if (this.ngComponentsTheme.themeId) {
      return ret + '?theme=' + this.ngComponentsTheme.themeId ;
    } else {
      return ret;
    }
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

  actionables_aux() {
    return [];
  }

  actionables() {
    const a: any[] = this.actionables_aux();
    if (this.closingSoon()) {
      return a.slice(1);
    }
    return a;
  }

  closingSoon() {
    const a: any[] = this.actionables_aux();
    return a && a.length > 0 && moment().diff(moment(this.item['claim_date'])) < 0;
  }

  closingSoonTitle() {
    const days = -moment().diff(moment(this.item['claim_date']), 'days');
    let ret = '';
    if (days === 1) {
      ret = 'נותר עוד יום אחד';
    } else {
      ret = 'נותרו עוד ' + days + ' ימים';
    }
    ret = `<strong>${ret} להגשה!</strong>&nbsp;`;
    return ret;
  }

  closingSoonAction() {
    const a: any[] = this.actionables_aux();
    return a[0];
  }

}
