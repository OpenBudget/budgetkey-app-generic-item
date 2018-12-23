import {Pipe, PipeTransform} from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'pairs'})
export class PairsPipe implements PipeTransform {
  transform(value: object = {}): any[] {
    return _.toPairs(value);
  }
}
