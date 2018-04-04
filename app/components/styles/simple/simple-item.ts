import { Component } from '@angular/core';

@Component({
    selector: 'simple-item',
    template: `
                    <simple-item-info></simple-item-info>
                    <simple-item-visualizations></simple-item-visualizations>  
              `
})
export class SimpleItemComponent {
}
