import { Component, Input } from '@angular/core';
import { StoreService } from '../../services';
import { Item } from '../../model';

@Component({
  selector: 'budgetkey-chart-router',
  template: `
    <budgetkey-chart-plotly               *ngIf="chart.type == 'plotly'"
        [data]="chart.chart" 
        [layout]="chart.layout"
    ></budgetkey-chart-plotly>
    <budgetkey-chart-mushonkey            *ngIf="chart.type == 'mushonkey'"
        [data]="chart.chart" 
    ></budgetkey-chart-mushonkey>
    <budgetkey-chart-horizontal-barchart  *ngIf="chart.type == 'horizontal-barchart'"
        [data]="chart.chart" 
    ></budgetkey-chart-horizontal-barchart>
    <budgetkey-chart-adamkey-wrapper     *ngIf="chart.type == 'adamkey'"
        [data]="chart.chart" 
    ></budgetkey-chart-adamkey-wrapper>
    <budgetkey-chart-template             *ngIf="chart.type == 'template'"
        [data]="chart.chart" 
    ></budgetkey-chart-template>
    <budgetkey-horizontal-layout          *ngIf="chart.type == 'horizontal'"
            [data]="chart.chart" 
    ></budgetkey-horizontal-layout>
    <budgetkey-vertical-layout            *ngIf="chart.type == 'vertical'"
            [data]="chart.chart" 
    ></budgetkey-vertical-layout>
    <budgetkey-chart-pointatron            *ngIf="chart.type == 'pointatron'"
            [data]="chart.chart" 
    ></budgetkey-chart-pointatron>
    <budgetkey-chart-comparatron            *ngIf="chart.type == 'comparatron'"
            [data]="chart.chart" 
    ></budgetkey-chart-comparatron>
    <budgetkey-chart-spendomat            *ngIf="chart.type == 'spendomat'"
            [data]="chart.chart" 
    ></budgetkey-chart-spendomat>
`
})
export class ChartRouterComponent {

    @Input() public chart: any;

    item: Item;
    private visualizationTemplates: Map<string, string>;

    constructor(private store: StoreService) {
        this.item = this.store.item;
        this.visualizationTemplates = this.store.descriptor.visualizationTemplates;
    }

    ngOnInit() {
        let chart = this.chart;
        if (chart.type === 'template') {
            if (!chart.chart) {
                chart.chart = {}
            }
            if (!chart.chart.template) {
                chart.chart = {}
                chart.chart.template = this.visualizationTemplates[chart.template_id];
                chart.chart.item = this.item;
            }
        }
    }
}
