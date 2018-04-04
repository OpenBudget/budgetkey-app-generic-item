import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[item-host]',
})
export class ItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
