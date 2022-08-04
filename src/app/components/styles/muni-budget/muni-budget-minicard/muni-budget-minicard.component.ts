import { Component, Input } from '@angular/core';

@Component({
  selector: 'muni-budget-minicard',
  templateUrl: './muni-budget-minicard.component.html',
  styleUrls: ['./muni-budget-minicard.component.less']
})
export class MuniBudgetMinicardComponent {
    @Input() item: any;
    @Input() entry: any;

    public get href() {
      return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}`;
    }
}
