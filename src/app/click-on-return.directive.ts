import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[clickOnReturn]'
})
export class ClickOnReturnDirective implements AfterViewInit{
  @Output() activated = new EventEmitter<Event>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('keydown', (event) => {
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        this.activated.emit(event);
      }
    });
    this.el.nativeElement.addEventListener('click', (event) => {
      this.activated.emit(event);
    });
  }

}
