import { Component, OnChanges } from '@angular/core';
import { DescriptorBase, MuniDescriptor, Chart } from '../../../model';

import { BaseItemInfoComponent } from '../../base-item-info';
import { format_number } from '../../../pipes';
import { timer } from 'rxjs';

@Component({
  selector: 'muni-item-info',
  templateUrl: './muni-item-info.html',
  styleUrls: ['./muni-item-info.less']
})
export class MuniItemInfoComponent extends BaseItemInfoComponent {

  descriptor: MuniDescriptor;

  props: any;

  format_number = format_number;

  budgets: any[] = [];
  incomeChartData: any = {};
  incomeChartLayout: any = {};
  incomeChartConfig: any = {displayModeBar: false};

  setDescriptor(descriptor: DescriptorBase) {
    this.descriptor = <MuniDescriptor>this.store.descriptor;
    timer(0).subscribe(() => {
      this.budgets = ((this.item.details && this.item.details.select_budgets) || ([] as any[])).sort((a, b) => b.value - a.value);
      this.incomeChartData = [{
        type: 'pie',
        labels: this.budgets.filter(b => b.code.length === 1).map(b => b.name),
        values: this.budgets.filter(b => b.code.length === 1).map(b => b.value),
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
}
