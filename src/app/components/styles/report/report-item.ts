import { Component } from '@angular/core';

@Component({
    selector: 'report-item',
    template: `
                    <report-item-info></report-item-info>
                    <simple-item-visualizations></simple-item-visualizations>  
              `
})
export class ReportItemComponent {
}
