import {Inject, Pipe, PipeTransform} from '@angular/core';
import { THEME_ID_TOKEN } from '../config';


@Pipe({name: 'searchlink'})
export class SearchLinkPipe implements PipeTransform {
  constructor(@Inject(THEME_ID_TOKEN) private theme_id: any) {}
  transform(params: string): string {
    return '//next.obudget.org/s/?' + params + (this.theme_id ? '&theme=' + this.theme_id : '');
  }
}

@Pipe({name: 'itemlink'})
export class ItemLinkPipe implements PipeTransform {
  constructor(@Inject(THEME_ID_TOKEN) private theme_id: any) {}
  transform(doc_type: string, entity_kind: string, entity_id: string): string {
    return '//next.obudget.org/i/' + doc_type + '/' + entity_kind + '/' + entity_id + (this.theme_id ? '?theme=' + this.theme_id : '');
  }
}
