import { Component } from '@angular/core';

@Component({
  selector: 'budgetkey-item-visualizations',
  template: `
    <div class="budgetkey-item-visualizations-wrapper row">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <div class="tabs text-center">
          <a href="javascript:void(0)" 
            *ngFor="let tab of tabs" [ngClass]="{active: tab == current}" 
            (click)="showTab(tab)">{{ tab }}</a>
        </div>
      </div>  
      <div class="col-xs-1"></div>
      <div class="tab-contents col-xs-12">
        <ng-container *ngFor="let tab of tabs">
          <div *ngIf="tab == current">
            Tab contents: {{ tab }}
            <div *ngFor="let i of []">{{ i }}<br>{{ i }}<br>{{ i }}<br></div>
          </div>
        </ng-container>
      </div>  
    </div>
  `
})
export class ItemVisualizationsComponent {
  tabs: string[] = [
    'לאן הולך הכסף?',
    'ממה מורכב התקציב?',
    'איך השתנה התקציב?',
    'מהיכן מגיע הכסף?',
    'מה עוד?',
  ];
  current: string = 'מה עוד?';

  showTab(tab: string) {
    this.current = tab;
  }
}
