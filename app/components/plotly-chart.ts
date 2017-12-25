import {Component, ViewChild, ElementRef, Input} from '@angular/core';
import {MushonKeyChart, MushonKeyFlowGroup, MushonKeyFlow} from 'mushonkey/lib/components/MushonkeyComponent';
import { Location } from '@angular/common';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-plotly-chart',
  template: `
    <div class='mushonkey-wrapper' *ngIf="this.data.type == 'mushonkey'">
        <mushonkey [chart]="mushonkeyChart" (onSelected)="onSelected($event)"></mushonkey>
    </div>
    <div style="direction: ltr" #plot>
    </div>
  `,
  styles: [`
      .mushonkey-wrapper {
        width: 90%;
        padding-right: 5%;
        height: 800px;
        direction: ltr;
      }
      
      :host >>> .centerpiece { 
          stroke: lightgray;
          stroke-width: 2;
          fill: gray;
       }
      
      :host >>> .centerpiece-text { 
          font-size: 20px;
          stroke: none;
          fill: white;
      }
      
      :host >>> .text { font-family: "Abraham TRIAL"; }
      
      :host >>> .budget-expense.connector { stroke: lightblue; }
      :host >>> .budget-expense.text { fill: voilet; }

      :host >>> .budget-parent.connector { stroke: red; }
      :host >>> .budget-parent.text { fill: white; }

      :host >>> .budget-revenues.connector { stroke: violet; }
      :host >>> .budget-revenues.text { fill: black; }

`]
})
export class PlotlyChartComponent {

  @Input() public data: any;
  @Input() public layout: any;

  @ViewChild('plot') plot: ElementRef;
  private mushonkeyChart: MushonKeyChart;

  constructor(private location: Location) {

  }

  onSelected(context: any) {
    window.location.href = window.location.origin + '/i/' + context;
  }

  ngOnInit() {
    if (this.data.type === 'mushonkey') {
      let groups: Array<MushonKeyFlowGroup> = [];
      for (let group of this.data.groups) {
        let flows: Array<MushonKeyFlow> = [];
        for (let flow of group.flows) {
          flows.unshift(new MushonKeyFlow(flow.size, flow.label, flow.context));
        }

        let mkfg = new MushonKeyFlowGroup(group.leftSide, flows, group.class, group.offset, group.width, group.slope, group.roundness);
        mkfg.labelTextSize = group.labelTextSize;
        groups.push(mkfg);
      }

      this.mushonkeyChart = new MushonKeyChart(
        groups,
        this.data.centerTitle,
        this.data.centerWidth,
        this.data.centerHeight,
        this.data.directionLeft
      );

    } else {
      let traces: any = this.data;
      let labels = null;
      if (traces[0].type === 'sankey') {
        labels = [];
        if (!!window.chrome) {
          if (!traces[0].node._orig_label) {
            traces[0].node._orig_label = traces[0].node.label;
            for (let label of traces[0].node._orig_label) {
              labels.push(label.split('').reverse().join(''));
            }
            traces[0].node.label = labels;
          }
        }
      }

      let layout = Object.assign({
        height: 600,
        font: {
          size: 10
        }
      }, this.layout);

      Plotly.plot(this.plot.nativeElement, traces, layout);
    }
  }
}
