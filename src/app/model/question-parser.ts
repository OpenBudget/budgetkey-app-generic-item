import { format_number } from '../pipes';
import { Question } from './questions';

export class QuestionParser {
    private static SIMPLE_MODIFIER = /:([-a-z_]+)$/;
    private static PARAMETER_MODIFIER = /:([-a-z_]+\([a-z_]+\))$/;

    private static getFormatter(mod: string, themeId: string) {
      // Simple modifiers first
      if (mod === 'number') {
        return (x: any, row: any) => {
          x = parseFloat(x);

          return isFinite(x)
            ? format_number(x)
            : '-';
        };
      } else if (mod === 'budget_code') {
        return (x: any, row: any) => {
          if (!x) {
            return '';
          }
          x = x.slice(2);
          let code = '';
          while (x.length > 0) {
            code += '.' + x.slice(0, 2);
            x = x.slice(2);
          }
          return code.slice(1);
        };
      } else if (mod === 'yesno') {
        return (x: any, row: any) => {
          return x ? 'כן' : 'לא';
        };
      } else if (mod === 'comma-separated') {
        return (x: string[], row: any) => {
          return x.join(', ');
        };
      } else { // Parametrized modifiers next
        const parts = mod.split('(');
        mod = parts[0];
        const param = parts[1].slice(0, parts[1].length - 1);
        if (mod === 'item_link') {
          return (x: any, row: any) => {
            const item_id = row[param];
            if (item_id) {
              let base = '';
              if (item_id.indexOf('activities/gov_social_service') === 0) {
                base = 'https://www.socialpro.org.il';
              }
              if (themeId) {
                return '<a href="' + base + '/i/' + item_id + '?theme=' + themeId + '">' + (x || '---') + '</a>';
              } else {
                return '<a href="' + base + '/i/' + item_id + '">' + (x || '---') + '</a>';
              }
            } else {
              return x;
            }
          };
        } else if (mod === 'search_term') {
          return (x: any, row: any) => {
            return '<a href="/s/?q=' + encodeURIComponent(x) + '" title="חיפוש מידע נוסף על  ' + x + '">' + x + '</a>';
          };
        } else {
          throw Error('Unknown formatter ' + mod);
        }
      }
    }

    private static getRowGetter(header: string) {
      return (x: any, row: any) => {
        return row[header];
      };
    }

    private static compose(func: any, func2: any) {
      return (x: any, row: any) => func2(func(x, row), row);
    }

    private static processHeadersFormatters(question: Question, themeId: string): any {
      if (question.originalHeaders) {
        // Don't process the same question twice
        return;
      }
      question.originalHeaders = question.headers;

      const _headers = [];
      const _formatters = [];

      for (let header of question.headers) {
        const _funcs: any[] = [];
        while (header.length > 0) {
          let found = false;
          for (const modifier of [this.SIMPLE_MODIFIER, this.PARAMETER_MODIFIER]) {
            if (modifier.test(header)) {
              const idx = header.search(modifier);
              const mod = header.slice(idx + 1);
              header = header.slice(0, idx);
              _funcs.push(this.getFormatter(mod, themeId));
              found = true;
              break;
            }
          }
          if (found) {
            continue;
          }

          _funcs.push(this.getRowGetter(header));
          let func: any = null;
          while (_funcs.length > 0) {
            if (func === null ) {
              func = _funcs.pop();
            } else {
              const func2 = _funcs.pop();
              func = this.compose(func, func2);
            }
          }

          _headers.push(header);
          _formatters.push((row: any) => func('', row));
          break;
        }
      }
      question.headers = _headers;
      question.formatters = _formatters;
    }

    static processQuestions(questions, themeId?) {
      for (const question of questions) {
        this.processHeadersFormatters(question, themeId);
      }
      return questions;
    }
  }
