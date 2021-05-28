import { Component, Input, OnInit } from '@angular/core';
import { BudgetKeyItemService, StoreService } from '../../services';
import { Item } from '../../model';
import { QuestionsManager } from '../questions/questions-manager';

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
    <ng-container *ngIf="chart.type == 'questions'">
        <budgetkey-item-questions [manager]='questionsManager' [label]='chart.label'></budgetkey-item-questions>
        <budgetkey-item-data-table [manager]='questionsManager'></budgetkey-item-data-table>
    </ng-container>
`
})
export class ChartRouterComponent implements OnInit {

    @Input() public chart: any;

    item: Item;
    private visualizationTemplates: Map<string, string>;
    questionsManager: QuestionsManager;

    constructor(private store: StoreService, private itemService: BudgetKeyItemService) {
        this.item = this.store.item;
        this.visualizationTemplates = this.store.descriptor.visualizationTemplates;
    }

    ngOnInit() {
        const chart = this.chart;
        if (chart.type === 'template') {
            if (!chart.chart) {
                chart.chart = {};
            }
            if (!chart.chart.template) {
                chart.chart.template = this.visualizationTemplates[chart.template_id];
                if (!chart.chart.item) {
                    chart.chart.item = this.item;
                }
            }
        }
        if (chart.type === 'questions') {
            this.questionsManager = new QuestionsManager(this.store, this.itemService);
            this.questionsManager.preparedQuestions = this.questionsManager.parseQuestions(
                this.chart.questions,
                this.store.item
            );
          
        }
    }
}
