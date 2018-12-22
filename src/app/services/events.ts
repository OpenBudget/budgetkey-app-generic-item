import { Injectable, EventEmitter } from '@angular/core';

// Application-wide event bus

@Injectable()
export class EventsService {

  dropdownActivate = new EventEmitter<any>();

}
