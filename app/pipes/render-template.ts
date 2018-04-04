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

env.addFilter('format_relative_percent', function(x: number) {
  if (x >= 0) {
    if (x > 1) {
      return safe('<span class="number">' + (100 * (x - 1)).toFixed(0) + '%</span> יותר');
    } else {
      return safe('<span class="number">' + (100 * x).toFixed(0) + '%</span>');
    }
  } else {
    return '?%';
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

env.addFilter('hebrew_list', function(x: any) {
  let i = 0;
  let ret = '';
  for (; i < x.length ; i++) {
    if (i > 0) {
      if (i === x.length - 1) {
        ret += ' ו';
      } else {
        ret += ', ';
      }
    }
    ret += '' + x[i];
  }
  return ret;
});

env.addFilter('search_link', function(searchTerm: string, displayDocs: string) {
  return env.renderString(
    '//next.obudget.org/s/?q={{encodeURIComponent(searchTerm)}}' +
          '{% if displayDocs %}&dd={{displayDocs}}{% endif %}' +
          '{% if themeId %}&theme={{themeId}}{% endif %}',
    {'searchTerm': searchTerm, 'displayDocs': displayDocs}
  );
});

env.addFilter('item_link', function(docType, docId) {
  return env.renderString(
    '//next.obudget.org/i/{{docType}}/{{docId}}{% if themeId %}?theme={{themeId}}{% endif %}',
    {'docType': docType, 'docId': docId}
  );
});

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}, themeId: string = null): string {
    env.addGlobal('themeId', themeId);
    return env.renderString(template, data);
  }
}
