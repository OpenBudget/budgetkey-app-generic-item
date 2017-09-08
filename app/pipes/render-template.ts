import {Pipe, PipeTransform} from '@angular/core';
import * as nunjucks from 'nunjucks';

@Pipe({name: 'renderTemplate'})
export class RenderTemplatePipe implements PipeTransform {
  transform(template: string, data: object = {}): string {
    return nunjucks.renderString(template, data);
  }
}
