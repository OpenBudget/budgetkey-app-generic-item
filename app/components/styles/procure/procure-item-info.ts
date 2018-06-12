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

  private _paymentsTable: Array<any> = null;

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
    } else if (!decision) {
      return null;
    }
    return 'N/A';
  }

  tagText() {
    let decision: string = this.item['decision'];
    if (decision) {
      if (decision === 'הסתיים') {
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
    return this.item['purchase_method'];
  }

  toText() {
    let decision: string = this.item['decision'];
    if (decision) {
      if (decision === 'בוטל') {
        return 'המכרז בוטל';
      }
    } else {
      if (this.item['entity_name']) {
        return this.item['entity_name'];
      } else {
        return this.item['supplier_name'][0];
      }
    }
  }

  publisher() {
    if (this.item['publisher']) {
      if (this.item['purchasing_unit']) {
        if (this.item['publisher'][0] !== this.item['purchasing_unit'][0]) {
          return this.item['publisher'][0] + ', ' + this.item['purchasing_unit'][0];
        } else {
          return this.item['publisher'][0];
        }
      }
      return this.item['publisher'];
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
    if (this.item['start_date'] && 
        moment(this.item['start_date']).isAfter(lastWeek)) {
      return 'חדש!';
    }
    if (this.item['last_update_date'] && 
        moment(this.item['last_update_date']).isAfter(lastWeek)) {
      return 'עודכן!';
    }
    if (this.item['contract_is_active'] === true) {
      return 'פעיל';
    }
    if (this.item['contract_is_active'] === false) {
      return 'לא פעיל';
    }
    return null;
  }

  lastUpdateDate() {
    if (this.item['last_update_date']) {
      return this.item['last_update_date'];
    }
    if (this.item['payments']) {
      return this.item['payments'][this.item['payments'].length - 1]['date'];
    }
  }

  firstUpdateDate() {
    if (this.item['start_date']) {
      return this.item['start_date'];
    }
    if (this.item['order_date']) {
      return this.item['order_date'];
    }
    if (this.item['payments']) {
      return this.item['payments'][0]['date'];
    }
  }

  itemTitle() {
    if (this.item['description']) {
      return this.item['description'];
    }
    if (this.item['purpose']) {
      return this.item['purpose'];
    }
  }

  totalAmount() {
    if (this.item['contract_volume'] >= 0) {
      return this.item['contract_volume'];
    } else {
      return this.item['volume'];
    }
  }

  totalPaid() {
    if (this.item['contract_executed'] >= 0) {
      return this.item['contract_executed'];
    } else {
      return this.item['executed'];
    }
  }

  paymentsTable(): Array<any> {
    if (!this.item['payments']) {
      return null;
    }
    if (!this._paymentsTable) {
      let r: Array<any> = [];
      let year = '';
      let period = '';
      let executed = 0;
      for (let p of this.item['payments']) {
        if (!p.period) { continue; }
        if (p.year !== year) {
          year = p.year;
          period = p.period;
          r.unshift({
            'year': year, '1': null, '2': null, '3': null, '4': null
          });
        } else {
          if (p.period === period) {
            continue;
          }
        }
        period = p.period;
        p.selected = true;
        p.diff = p.executed - executed;
        executed = p.executed;
        r[0][p.period] = p;
      }
      for (let p of this.item['payments']) {
        if (!p.period) { continue; }
        let period = parseInt(p.period, 10);
        while (period > 1) {
          period--;
          this.item['payments'].unshift({
            'selected': true,
            'executed': 0,
            'diff': 0,
            'year': p.year,
            'period': '' + period
          });
        }
        break;
      }
      console.log('PT', r);
      this._paymentsTable = r;
    }
    return this._paymentsTable;
  }

  actionables() {
    return this.item['awardees'];
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

  entityLink(awardee: any) {
    let ret = '/i/entity/' + awardee.entity_kind + '/' + awardee.entity_id;
    if (this.ngComponentsTheme.themeId) {
      return ret + '?theme=' + this.ngComponentsTheme.themeId ;
    } else {
      return ret;
    }
  }
}
