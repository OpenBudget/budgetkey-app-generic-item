import { Component, Input, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { ItemDirective } from './item-directive';
import { SimpleItemComponent, ReportItemComponent, OrgItemComponent, ProcureItemComponent, PeopleItemComponent } from './styles';

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
        org: OrgItemComponent,
        procure: ProcureItemComponent,
        people: PeopleItemComponent,
    };

    @Input() style: string;
    @ViewChild(ItemDirective) itemHost: ItemDirective;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit() {
        this.loadComponent();
    }

    loadComponent() {
        const item = this.components[this.style];
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item);
        const viewContainerRef = this.itemHost.viewContainerRef;
        viewContainerRef.clear();
        viewContainerRef.createComponent(componentFactory);
  }
}
