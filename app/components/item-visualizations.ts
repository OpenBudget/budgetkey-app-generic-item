import { Component } from '@angular/core';

@Component({
  selector: 'budgetkey-item-visualizations',
  styles: [`
    .col-xs-10 {
      min-height: 300px;
      background: rgba(250, 250, 250, 0.3);
      box-shadow: inset 0 1px 10px 0 rgba(0,0,0,0.05);
      margin: 14px 0 28px 0;
    }
    
    .tabs a {
      margin: 0 5px;
    }
    
    .tabs .active {
      color: #f00;
    }
  `],
  template: `
    <div class="row">
      <div class="col-xs-1"></div>
      <div class="col-xs-10">
        <div class="tabs">
          <div class="text-center">
            <a href="javascript:void(0)" 
              *ngFor="let tab of tabs" [ngClass]="{active: tab == current}" 
              (click)="showTab(tab)">Tab {{ tab }}</a>
          </div>  
          <ng-container *ngFor="let tab of tabs">
            <div *ngIf="tab == current">Tab contents {{ tab }}</div>
          </ng-container>
        </div>
      </div>
      <div class="col-xs-1"></div>
    </div>
  `
})
export class ItemVisualizationsComponent {
  tabs: string[] = ['#1', '#2', '#3'];
  current: string = '#1';

  showTab(tab: string) {
    this.current = tab;
  }
}
