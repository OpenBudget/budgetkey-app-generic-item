import {Pipe, PipeTransform} from '@angular/core';
import * as nunjucks from 'nunjucks';

let env = new nunjucks.Environment();
env.addFilter('format_number', function(x: any) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}): string {
    return env.renderString(template, data);
  }
}
