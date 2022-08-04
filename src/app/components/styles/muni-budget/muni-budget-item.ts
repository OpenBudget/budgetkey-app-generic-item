import { Component } from '@angular/core';

@Component({
    selector: 'muni-budget-item',
    template: `
                    <muni-budget-item-info></muni-budget-item-info>
                    <simple-item-visualizations></simple-item-visualizations>
              `
})
export class MuniBudgetItemComponent {
}
