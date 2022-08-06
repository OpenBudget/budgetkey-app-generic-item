import { Component, Input, Inject } from '@angular/core';
import { THEME_TOKEN } from 'budgetkey-ng2-components';

@Component({
  selector: 'muni-budget-link',
  templateUrl: './muni-budget-link.component.html',
  styleUrls: ['./muni-budget-link.component.less']
})
export class MuniBudgetLinkComponent {
    @Input() item: any;
    @Input() entry: any;

    constructor(@Inject(THEME_TOKEN) private ngComponentsTheme: any) {}

    public get href() {
        return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}?theme=${this.ngComponentsTheme.themeId}`;
    }
}
