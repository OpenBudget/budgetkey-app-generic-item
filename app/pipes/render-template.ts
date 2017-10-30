import {Pipe, PipeTransform} from '@angular/core';
import * as nunjucks from 'nunjucks';

let env = new nunjucks.Environment();
env.addFilter('format_number', function(x: number) {
  if (x) {
    return x.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2});
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


@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}): string {
    return env.renderString(template, data);
  }
}
