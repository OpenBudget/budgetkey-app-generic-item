import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { ItemDirective } from './item-directive';
import { SimpleItemComponent, ReportItemComponent } from './styles';

@Component({
    selector: 'budgetkey-item-container',
    template: `
                    <ng-template item-host></ng-template>
              `
})
export class ItemContainerComponent implements OnInit {
    components: any = {
        simple: SimpleItemComponent,
        report: ReportItemComponent,
    };

    @Input() style: string;
    @ViewChild(ItemDirective) itemHost: ItemDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        let item = this.components[this.style];
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(item);
        let viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
  }
}
