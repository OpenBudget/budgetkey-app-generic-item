import { Component, Input, Inject } from '@angular/core';
import { Location } from '@angular/common';

import {THEME_TOKEN} from 'budgetkey-ng2-components';

@Component({
  selector: 'budgetkey-chart-horizontal-barchart',
  template: `
  <div class="chart">
    <table>
      <tbody>
        <tr *ngFor='let value of data.values; let i = index'>
          <td class='cell-index'>{{ i + 1 }}</td>
          <td class='cell-label' [innerHTML]="value.label"></td>
          <td class='cell-bar'>
            <span class="bar-bg"></span>
            <span class="bar" [style.width]="100 * (value.value / maxValue) + '%'"></span>
            <span class="bar-label">{{ value.value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    `,
  styles: [
    `
.chart {
  max-height: 570px;
  overflow-y: scroll;
}

table {
  width: 75%;
  font-size: 14px;
}

@media only screen and (max-width: 600px) {
  table {
    width: 100%;
  }
}

tr {
  height: 57px;
}

.cell-index {
  opacity: 0.8;	
  color: #C3C3C3;	
  font-family: "Abraham TRIAL";	
  font-size: 18px;	
  text-align: right;
  padding-left: 5px;
}

.cell-label {
  color: #4A4A4A;	
  font-family: "Abraham TRIAL";
  font-weight: bold;
  border-left: solid #888 1px ;
}

.cell-bar {
  color: #3E4E59;	
  font-family: "Miriam Libre";
  width: 85%;
  position: relative;
}

.bar-bg {
  position: absolute;
  top: 11px;
  right: 0px;
  display: inline-block;
  width: 100%;
  height: 30px;
  opacity: 0.23;	
  background-color: #E5E5E5;
}

.bar {
  position: absolute;
  top: 11px;
  right: 0px;
  display: inline-block;
  height: 30px;
  border: 1px solid #FFCAB6;
  opacity: 0.5;
  background-color: #FFCAB6;
}

.bar-label {
  position: relative;
  right: 11px;
}
    `
  ]
})
export class HorizontalBarchartChartComponent {

  @Input() public data: any;
  maxValue: number = 1;

  constructor(private location: Location,
              @Inject(THEME_TOKEN) private ngComponentsTheme: any) {
  }

  ngOnInit() {
    for (let v of this.data.values) {
      if (v.value > this.maxValue) {
        this.maxValue = v.value;
      }
      if (this.ngComponentsTheme.themeId) {
        v.label = v.label.replace('theme=budgetkey', 'theme=' + this.ngComponentsTheme.themeId);
      }
    }
    this.maxValue *= 1.15;
  }

  onSelected(context: any) {
    let href = window.location.origin + '/i/' + context;
    if (this.ngComponentsTheme.themeId) {
      href += '?theme=' + this.ngComponentsTheme.themeId;
    }
    window.location.href = href;
  }

}
