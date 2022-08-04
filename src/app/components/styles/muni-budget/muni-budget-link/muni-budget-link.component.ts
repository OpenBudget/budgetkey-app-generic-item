import { Component, Input } from '@angular/core';

@Component({
  selector: 'muni-budget-link',
  templateUrl: './muni-budget-link.component.html',
  styleUrls: ['./muni-budget-link.component.less']
})
export class MuniBudgetLinkComponent {
    @Input() item: any;
    @Input() entry: any;

    public get href() {
        return `/i/muni_budgets/${this.item.muni_code}/${this.entry.code}/${this.item.year}`;
    }
}
