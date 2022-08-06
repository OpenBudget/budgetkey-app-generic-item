import { Component, Input, Inject } from '@angular/core';
import { THEME_TOKEN } from 'budgetkey-ng2-components';

@Component({
  selector: 'muni-budget-minicard',
  templateUrl: './muni-budget-minicard.component.html',
  styleUrls: ['./muni-budget-minicard.component.less']
})
export class MuniBudgetMinicardComponent {
    @Input() item: any;
    @Input() entry: any;

    constructor(@Inject(THEME_TOKEN) private ngComponentsTheme: any) {}

    public get href() {
      return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}?theme=${this.ngComponentsTheme.themeId}`;
    }
}
