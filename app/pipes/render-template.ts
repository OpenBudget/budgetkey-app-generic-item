import {Pipe, PipeTransform} from '@angular/core';
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

env.addFilter('search_link', function(searchTerm: string, displayDocs: string, themeId: string) {
  return '//next.obudget.org/s/?' +
    'q=' + encodeURIComponent(searchTerm) +
    (displayDocs ? '&dd=' + displayDocs : '') +
    (themeId ? '&theme=' + themeId : '');
});

env.addFilter('item_link', function(docType, docId, themeId: string) {
  return '//next.obudget.org/i/' + docType + '/' + docId +
    (themeId ? '?theme=' + themeId : '');
});

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}, themeId: string = null): string {
    data['theme_id'] = themeId;
    return env.renderString(template, data);
  }
}
