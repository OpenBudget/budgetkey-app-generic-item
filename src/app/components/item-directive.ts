import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[itemHost]',
})
export class ItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
