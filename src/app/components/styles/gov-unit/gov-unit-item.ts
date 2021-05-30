import { Component, OnInit } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { first, map, mergeMap, switchMap } from 'rxjs/operators';
import { BudgetKeyItemService } from '../../../services';
import { QuestionParser } from '../../../model/question-parser';

import {StoreService} from '../../../services/store';

@Component({
    selector: 'gov-unit-item',
    template: `
                    <simple-item-info></simple-item-info>
                    <simple-item-visualizations></simple-item-visualizations>
              `
})
export class GovUnitItemComponent implements OnInit {

    private item: any;
    private parameters: any = {};
    private defaults: any = {};
    private levelCond = 'TRUE';
    private groupByLvl: string = null;
    private ready = new ReplaySubject<void>(1);

    constructor(private store: StoreService, private api: BudgetKeyItemService) {
      const fields = ['subject', 'intervention', 'target_audience', 'target_age_group'];
      from(fields).pipe(
        mergeMap((field) => {
          return api.getDatarecords(field).pipe(
            map((results) => {
              return {results, field};
            })
          );
        })
      ).subscribe(({results, field}) => {
        const {params, dflt} = this.processParams(results, field, false);
        this.parameters[field] = params;
        this.defaults[field] = dflt;
        if (Object.keys(this.parameters).length === fields.length) {
          this.ready.next();
        }
      });
    }

    processParams(records, field, female) {
      const params = {};
      const dflt = female ? 'כלשהי' : 'כלשהו';
      params[dflt] = 'TRUE';
      for (const rec of records) {
        params[rec['name']] = `(${field}::text) LIKE '%%"${rec.name}"%%'`;
      }
      return {params, dflt};
    }

    processLevel(item) {
      const levelCondParts = [];
      this.groupByLvl = null;
      for (const lvl of ['office', 'unit', 'subunit', 'subsubunit']) {
        if (item[lvl]) {
          levelCondParts.push(`${lvl} = '${item[lvl]}'`);
        } else if (!this.groupByLvl) {
          this.groupByLvl = lvl;
        } else {
          break;
        }
      }
      this.levelCond = levelCondParts.join(' AND ') || 'TRUE';
    }

    servicesQuestions(item) {
      const ret = [];
      ret.push({
        text: `כל השירותים החברתיים ב${this.item.breadcrumbs} עם אופן התערבות <intervention>, ` +
              `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
        query: [
            `select office as "משרד",
                    unit as "מנהל",
                    subunit as "אגף",
                    subsubunit as "יחידה",
                    name as "שם השירות",
                    intervention as "אופני התערבות",
                    subject as "תחומי התערבות",
                    target_age_group as "קבוצות גיל",
                    target_audience as "אוכלוסיות יעד"
                    from activities
                    where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}`
        ],
        parameters: this.parameters,
        defaults: this.defaults,
        headers: [
          'משרד',
          'מנהל',
          'אגף',
          'יחידה',
          'שם השירות',
          'אופני התערבות:comma-separated',
          'תחומי התערבות:comma-separated',
          'קבוצות גיל:comma-separated',
          'אוכלוסיות יעד:comma-separated',
        ]
      });
      ret.push({
        text: `פילוח השירותים החברתיים ברמה הארגונית עם אופן התערבות <intervention>, ` +
              `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
        query: [
            `select ${this.groupByLvl} as "גוף",
                    count(1) as "מספר שירותים"
                    from activities
                    where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}
                    group by ${this.groupByLvl} order by 2 desc`
        ],
        parameters: this.parameters,
        defaults: this.defaults,
        headers: [
          'גוף',
          'מספר שירותים',
        ],
        graphFormatter: {
          type: 'bars',
          x_field: 'גוף',
          series: [
            {
              field: 'מספר שירותים'
            }
          ]
        }
      });
      ret.push({
        text: `פילוח השירותים החברתיים לפי מספר מפעילים עם אופן התערבות <intervention>, ` +
              `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
        query: [`
select ${this.groupByLvl} as "גוף",
  sum(case when jsonb_typeof(suppliers) != 'array' or jsonb_array_length(suppliers)=0 then 1 else 0 end) as "ללא מפעילים",
  sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers)=1 then 1 else 0 end) as "מפעיל אחד",
  sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers) in (2,3,4,5) then 1 else 0 end) as "בין 2 ל-5 מפעילים",
  sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers) >= 6 then 1 else 0 end) as "מעל 6 מפעילים"
  from activities
  where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}
  group by ${this.groupByLvl} order by 1 asc`
        ],
        parameters: this.parameters,
        defaults: this.defaults,
        headers: [
          'גוף',
          'ללא מפעילים',
          'בין 2 ל-5 מפעילים',
          'מעל 6 מפעילים',
        ],
        graphFormatter: {
          type: 'bars',
          x_field: 'גוף',
          series: [
            {
              field: 'ללא מפעילים'
            },
            {
              field: 'מפעיל אחד'
            },
            {
              field: 'בין 2 ל-5 מפעילים'
            },
            {
              field: 'מעל 6 מפעילים'
            }
          ]
        }
      });
      return ret;
    }

    ngOnInit() {
      this.item = this.store.item;
      console.log('ITEM', this.item);
      this.processLevel(this.item);
      this.item.charts = [];
      this.ready.pipe(first()).subscribe(() => {
        this.item.charts = [
          {
            title: 'שירותים',
            long_title: 'השירותים החברתיים במיקור חוץ',
            description: 'מידע נוסף על השירותים החברתיים, התקציב שלהם ומאפיינים נוספים שלהם',
            type: 'questions',
            label: 'שאילתות<br/>מוכנות',
            questions: QuestionParser.processQuestions(this.servicesQuestions(this.item))
          },
          {
            title: 'תקציב',
            long_title: 'התקציב המוקצב לשירותים השונים',
            description: 'התקציב המאושר והמבוצע לשירותים השונים, כפי שדווח על ידי המשרדים.',
          },
          {
            title: 'מפעילים',
            long_title: 'הגופים המפעילים את השירותים השונים',
            description: 'מידע נוסף על הספקים או העמותות המפעילות את השירותים החברתיים ומאפיינים נוספים שלהם',
          },
        ];
        this.store.item = this.store.item;
      });
    }

}
