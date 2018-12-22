import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value: object = {}): any[] {
    return _.keys(value);
  }
}
