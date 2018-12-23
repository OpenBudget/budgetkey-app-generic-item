import { Component } from '@angular/core';

@Component({
    selector: 'org-item',
    template: `
                    <org-item-info></org-item-info>
                    <simple-item-visualizations></simple-item-visualizations>
              `
})
export class OrgItemComponent {
}
