import { Pipe, PipeTransform} from '@angular/core';
import { ThemeService } from '../services';


@Pipe({name: 'searchlink'})
export class SearchLinkPipe implements PipeTransform {
  constructor(private theme: ThemeService) {}
  transform(urlEncodedParams: string): string {
    return '//next.obudget.org/s/?' + urlEncodedParams +
      (this.theme.themeId ? '&theme=' + this.theme.themeId : '');
  }
}


@Pipe({name: 'itemlink'})
export class ItemLinkPipe implements PipeTransform {
  constructor(private theme: ThemeService) {}
  transform(doc_type: string, entity_kind: string, entity_id: string): string {
    return '//next.obudget.org/i/' + doc_type + '/' + entity_kind + '/' + entity_id +
      (this.theme.themeId ? '?theme=' + this.theme.themeId : '');
  }
}
