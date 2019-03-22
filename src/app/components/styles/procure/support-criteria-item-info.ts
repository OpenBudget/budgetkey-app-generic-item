import { Component } from '@angular/core';
import { ProcureItemInfoComponent } from './procure-item-info';

@Component({
  selector: 'support-criteria-item-info',
  templateUrl: './support-criteria-item-info.html',
})
export class SupportCriteriaItemInfoComponent extends ProcureItemInfoComponent {

  private _paymentsTable: Array<any> = null;

  toText() {
    if (this.item['entity_name']) {
      return this.item['entity_name'];
    } else if (this.item['supplier_name']) {
      return this.item['supplier_name'][0];
    }
  }

  publisher() {
    if (this.item['publisher']) {
      if (this.item['purchasing_unit']) {
        if (this.item['purchasing_unit'][0].indexOf(this.item['publisher'][0]) === -1) {
          return this.item['publisher'][0] + ', ' + this.item['purchasing_unit'][0];
        } else {
          return this.item['purchasing_unit'][0];
        }
      }
      return this.item['publisher'];
    }
  }

  alertText() {
    if (this.item['contract_is_active'] === true) {
      return 'פעיל';
    } else {
      return 'לא פעיל';
    }
  }

  totalPaid() {
    return this.item['executed'];
  }

  totalAmount() {
    return this.item['volume'];
  }

  paymentsTable(): Array<any> {
    if (!this._paymentsTable) {
      const r: Array<any> = [];
      let year = '';
      let period = '';
      let executed = 0;
      for (const p of this.item['payments']) {
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
      for (const p of this.item['payments']) {
        if (!p.period) { continue; }
        let periodNum = parseInt(p.period, 10);
        while (periodNum > 1) {
          periodNum--;
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
      this._paymentsTable = r;
    }
    return this._paymentsTable;
  }
}
