import { Component, Input } from '@angular/core';

@Component({
  selector: 'budgetkey-item-header',
  styles: [`
    .budgetkey-header {
      height: 50px;
      width: 1285px;
      background-color: #FEC9C7;
      box-shadow: inset 0 3px 0 0 #C20A04, 0 -42px 0 0 #FFFFFF;
    }
    .budgetkey-header-name {
      height: 42px;
      width: 302px;
      color: #C20801;
      font-family: "Miriam Libre";
      font-size: 32px;
      font-weight: bold;
      line-height: 42px;
      text-align: right;
    }
    .budgetkey-header-num {
      height: 19px;
      width: 47px;
      color: #C20801;
      font-family: "Miriam Libre";
      font-size: 14px;
      line-height: 19px;
    }
    .budgetkey-header-sum {
      height: 29px;
      width: 229px;
      color: #C20801;
      font-family: "Hiragino Sans";
      font-size: 22px;
      line-height: 33px;
      text-align: right;
  }
  `],
  template: `
        <div class="budgetkey-header">
        <span class="budgetkey-header-num">num</span> <!-- {{budget.allocated?}}-->
        <span class="budgetkey-header-name">דיור ציבורי</span>
        <span class="budgetkey-header-sum">sum</span>
        </div>
  `,
})

export class BudgetKeyItemHeader  {
}
