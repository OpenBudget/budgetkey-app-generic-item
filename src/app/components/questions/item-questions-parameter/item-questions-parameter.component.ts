import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventsService } from '../../../services';

@Component({
  selector: 'budgetkey-item-questions-parameter',
  templateUrl: './item-questions-parameter.component.html',
  styleUrls: ['./item-questions-parameter.component.less']
})
export class ItemQuestionParameterComponent implements OnDestroy {
  private eventSubscriptions: any[] = [];

  @Input() public value: any;
  @Input() public values: any[];
  @Output() public change = new EventEmitter<any>();

  isDropDownVisible = false;

  constructor(private events: EventsService) {
    this.eventSubscriptions = [
      this.events.dropdownActivate.subscribe(
        (dropdown: any) => {
          if (dropdown !== this) {
            this.isDropDownVisible = false;
          }
        }
      ),
    ];
  }

  toggleDropdown() {
    this.isDropDownVisible = !this.isDropDownVisible;
    if (this.isDropDownVisible) {
      this.events.dropdownActivate.emit(this);
    }
  }

  setValue(value: any) {
    this.value = value;
    this.isDropDownVisible = false;
    this.change.emit(this.value);
  }

  ngOnDestroy() {
    this.eventSubscriptions.forEach(subscription => subscription.unsubscribe());
    this.eventSubscriptions = [];
  }

}
