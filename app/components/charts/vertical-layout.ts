import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetkey-vertical-layout',
  template: `
    <div class='vertical-part' *ngFor="let inner of data.parts">
        <div *ngIf="inner.title" class="title">{{ inner.title }}</div>
        <budgetkey-chart-router [chart]="inner"></budgetkey-chart-router>
    </div>
  `,
  styles: [
`
.vertical-part {
  padding: 44px;
  display: flex;
  flex-flow: column;
  border-bottom: 1px solid #979797;
}

.title {
  color: #4A4A4A;	
  font-family: "Miriam Libre";	
  font-size: 20px;	
  font-weight: bold;
  mergin-bottom: 44px;
}
`
  ]
})
export class VerticalLayoutComponent {

  @Input() public data: any;

  constructor() {
  }
}
