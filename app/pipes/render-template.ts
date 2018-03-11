import { Pipe, PipeTransform } from '@angular/core';
import * as nunjucks from 'nunjucks';

let env = new nunjucks.Environment();
let safe: any = env.getFilter('safe');
env.addFilter('format_number', function(x: number) {
  if (x) {
    return safe('<span class="number">' + x.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2}) + '</span>');
  } else {
    return '-';
  }
});

env.addFilter('load_json', function(x: string) {
  if (x) {
    return JSON.parse(x);
  } else {
    return null;
  }
});

env.addFilter('split', function(x: string) {
  if (x) {
    return x.split(':');
  } else {
    return [];
  }
});

env.addFilter('search_link', function(urlEncodedParams: string, theme_id: string) {
  return '//next.obudget.org/s/?' + urlEncodedParams + (theme_id ? '&theme=' + theme_id : '');
});

env.addFilter('item_link', function(doc_type, entity_kind, entity_id, theme_id: string) {
  return '//next.obudget.org/i/' + doc_type + '/' + entity_kind + '/' + entity_id + (theme_id ? '?theme=' + theme_id : '');
});

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}, themeId: string = null): string {
    data['theme_id'] = themeId;
    return env.renderString(template, data);
  }
}
