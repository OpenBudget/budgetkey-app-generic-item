import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetkey-horizontal-layout',
  template: `
    <ng-container *ngFor="let inner of data.parts">
        <budgetkey-chart-router [chart]="inner"></budgetkey-chart-router>
    </ng-container>
  `
})
export class HorizontallLayoutComponent {

  @Input() public data: any;

  constructor() {
  }
}
