import {Pipe, PipeTransform} from '@angular/core';
import * as nunjucks from 'nunjucks';
import * as _ from 'lodash';

let env = new nunjucks.Environment();
let safe: any = env.getFilter('safe');
env.addFilter('format_number', function(x: number) {
  if (x) {
    let fracDigits = 0;
    if (x < 1000) {
      fracDigits = 2;
    }
    return safe('<span class="number">' +
                x.toLocaleString('en-US', {style: 'decimal',
                                           maximumFractionDigits: fracDigits}) +
                '</span>');
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
  return safe(ret);
});

env.addFilter('search_url', function(searchTerm: string, displayDocs: string) {
  return env.renderString(
    '//next.obudget.org/s/?q={{searchTerm}}' +
          '{% if displayDocs %}&dd={{displayDocs}}{% endif %}' +
          '{% if themeId %}&theme={{themeId}}{% endif %}',
    {searchTerm: encodeURIComponent(searchTerm), displayDocs: displayDocs}
  );
});

env.addFilter('item_url', function(docId) {
  return env.renderString(
    '//next.obudget.org/i/{{docId}}{% if themeId %}?theme={{themeId}}{% endif %}',
    {docId: docId}
  );
});

env.addFilter('item_link', function(text, docId: string) {
  return safe(env.renderString(
    '<a href="{{ docId | item_url }}">{{text}}</a>',
    {text: text, docId: docId}
  ));
});

env.addFilter('search_link', function(text, searchTerm: string, displayDocs: string) {
  return safe(env.renderString(
    '<a href="{{ searchTerm | search_url(displayDocs) }}">{{text}}</a>',
    {text: text, searchTerm: searchTerm, displayDocs: displayDocs}
  ));
});

env.addFilter('links_to_item', function(list, docIdTemplate: string) {
  return _.map(
    list,
    (term: string) => {
      let docId = docIdTemplate.replace(':term', term);
      return safe(env.renderString('{{ term | item_link(docId) }}', {term: term, docId: docId}));
    }
  );
});

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}, themeId: string = null): string {
    env.addGlobal('themeId', themeId);
    data['_math'] = Math;
    return env.renderString(template, data);
  }
}
