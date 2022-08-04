import { Component, OnChanges } from '@angular/core';
import { DescriptorBase, MuniDescriptor, Chart } from '../../../model';

import { BaseItemInfoComponent } from '../../base-item-info';
import { format_ils } from '../../../pipes';
import { timer } from 'rxjs';

@Component({
  selector: 'muni-item-info',
  templateUrl: './muni-item-info.html',
  styleUrls: ['./muni-item-info.less']
})
export class MuniItemInfoComponent extends BaseItemInfoComponent {

  descriptor: MuniDescriptor;

  props: any;

  format_ils = format_ils;

  budgets: any[] = [];
  incomeChartData: any = {};
  incomeChartLayout: any = {};
  incomeChartConfig: any = {displayModeBar: false};
  incomeBudgets: any[] = []
  expenseBudgets: any[] = []
  totalIncome = 0;
  totalExpense = 0;

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <MuniDescriptor>this.store.descriptor;
    timer(0).subscribe(() => {
      this.budgets = ((this.item.details && this.item.details.select_budgets) || ([] as any[])).sort((a, b) => b.value - a.value);
      this.budgets.forEach((b) => {
        if (!b.use) {
          if (b.code.length === 1 && b.code[0] < '6') {
            b.use = 'income-pie';
          } else if (b.code.length === 2) {
            b.use = 'selected';
          }
        }
        if (b.code.length === 1) {
          b.num_value = b.executed || b.revised || b.allocated;
          if (b.code[0] < '6') {
            this.incomeBudgets.push(b);
            this.totalIncome += b.value;
          } else {
            this.expenseBudgets.push(b);
            this.totalExpense += b.value;
          }
        }
      });
      this.budgets.forEach((b) => {
        if (b.code.length === 1) {
          b.muni_code = this.ext.symbol.value;
          if (b.code[0] < '6') {
            b.pct = (b.num_value / this.totalIncome) * 100 + '%';
          } else {
            b.pct = (b.num_value / this.totalExpense) * 100 + '%';
          }
          b.value = format_ils(b.num_value);
        }
      });
      this.incomeBudgets = this.incomeBudgets.sort((a, b) => a.code.localeCompare(b.code));
      this.expenseBudgets = this.expenseBudgets.sort((a, b) => a.code.localeCompare(b.code));
      this.incomeChartData = [{
        type: 'pie',
        labels: this.budgets.filter(b => b.use === 'income-pie').map(b => b.name),
        values: this.budgets.filter(b => b.use === 'income-pie').map(b => b.num_value),
        hole: .4,
      }];
      this.incomeChartLayout = {
        height: 300,
        width: 400,
        margin: {b:0, l:0, r:0, t:0},
        legend: {bgcolor: 'rgba(255,255,255,0)'},
        paper_bgcolor: '#F3F3F3',
        plot_bgcolor: 'rgba(255,255,255,0)',
        colorway : ['#022E57', '#03548F', '#08A6A7', '#0CB0A7', '#0DC0DE']
      };
    });
  }

  public get ext(): any {
    return (this.item.details && this.item.details.extended) || ({} as any);
  }

  budgetHref(budget: any) {
    return `/i/muni_budgets/${this.ext.symbol.value}/${budget.code}`;
  }
}
