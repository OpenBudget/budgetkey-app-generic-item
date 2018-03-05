import {Inject, Pipe, PipeTransform} from '@angular/core';
import * as nunjucks from 'nunjucks';
import {THEME_ID_TOKEN} from "../config";

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



@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  constructor(@Inject(THEME_ID_TOKEN) private theme_id: any) {
    env.addFilter('itemlink', function(params: string) {
      return '//next.obudget.org/i/' + params + (this.theme_id ? '?theme=' + this.theme_id : '');
    });
    env.addFilter('searchlink', function(params: string) {
      return '//next.obudget.org/s/?' + params + (this.theme_id ? '&theme=' + this.theme_id : '');
    });
  }
  transform(template: string, data: object = {}): string {
    return env.renderString(template, data);
  }
}
