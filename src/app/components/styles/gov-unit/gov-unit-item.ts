import { Component, OnInit } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { first, map, mergeMap, switchMap } from 'rxjs/operators';
import { BudgetKeyItemService } from '../../../services';
import { QuestionParser } from '../../../model/question-parser';

import {StoreService} from '../../../services/store';

@Component({
    selector: 'gov-unit-item',
    templateUrl: `./gov-unit-item.html`,
    styleUrls: [`./gov-unit-item.less`]
})
export class GovUnitItemComponent implements OnInit {

    private item: any;

    PAGE_LINKS = [
      {title: 'משרדי הממשלה', href: '/units/gov_social_service_unit/main'},
      {title: 'משרד הרווחה', href: '/units/gov_social_service_unit/משרד הרווחה'},
      {title: 'משרד הבריאות', href: '/units/gov_social_service_unit/משרד הבריאות'},
      {title: 'משרד החינוך', href: '/units/gov_social_service_unit/משרד החינוך'},
    ];   
    PAGE_FILTERS = [
      {title: 'אופן ההתערבות', id: 'intervention'},
      {title: 'קבוצת גיל', id: 'target_age_group'},
      {title: 'אוכלוסיית היעד', id: 'target_audience'},
      {title: 'תחום ההתערבות', id: 'subject'},
      {title: 'מודל תמחור', id: 'pricing_model'},
    ];

    private parameters: any = {
      pricing_model: [
        {value: 'TRUE', display: 'כלשהו'},
        {value: `(tenders::text) like '%%"fixed"%%'`, display: 'מחיר קבוע'},
        {value: `(tenders::text) like '%%"proposal"%%'`, display: 'הצעת מחיר'},
        {value: `(tenders::text) like '%%"combined"%%'`, display: 'משולב'},
      ]
    };
    private levelCond = 'TRUE';
    private groupByLvl: string = null;
    private ready = new ReplaySubject<void>(1);
    private filters = {
      pricing_model: 'TRUE',
    };
    public currentTab = 'services';
    private chartTemplates = [
      {
        location: 'services',
        id: 'services',
        query: `select :org-field as "משרד",
            count(1) as value
            from activities where :where group by 1 order by 1`,
        title: 'שירותים',
        subtitle: 'סה״כ :total שירותים',
        x_field: 'משרד',
        y_field: 'value',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          return [{
            type: 'bar',
            name: info.title,
            x: items.map((x) => x[info.x_field]),
            y: items.map((x) => x[info.y_field]),
          }];
        }
      },
      {
        location: 'services',
        id: 'budget',
        query: `select :org-field as "משרד",
            sum(current_budget) as value
            from activities where :where group by 1 order by 1`,
        title: 'תקציב מאושר',
        subtitle: 'סה״כ :total ₪',
        x_field: 'משרד',
        y_field: 'value',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          return [{
            type: 'bar',
            name: info.title,
            x: items.map((x) => x[info.x_field]),
            y: items.map((x) => x[info.y_field]),
          }];
        }
      },
      {
        location: 'services',
        id: 'supplier_kinds',
        query: `WITH objs AS
        (SELECT :org-field,
                jsonb_array_elements(suppliers::JSONB) AS obj
         FROM activities
         WHERE :where AND suppliers IS NOT NULL 
           AND suppliers != 'null' )
      SELECT :org-field as "משרד",
             case obj->>'entity_kind'
             when 'company' then 'עסקי'
             when 'municipality' then 'רשויות מקומיות'
             when 'association' then 'מגזר שלישי'
             when 'ottoman-association' then 'מגזר שלישי'
             when 'cooperative' then 'מגזר שלישי'
             else 'אחר'
             end as kind,
            count(DISTINCT (obj->>'entity_id')) as value
      FROM objs
      GROUP BY 1,
               2
      order by 1`,
        title: 'מפעילים',
        x_field: 'משרד',
        y_field: 'value',
        subtitle: 'מפעילים שעובדים עם מספר משרדים במקביל נספרים פעם אחת בלבד',
        layout: {
          barmode: 'stack',
        },
        data: (items, info) => {
          return ['עסקי', 'מגזר שלישי', 'רשויות מקומיות', 'אחר'].map((kind) => {
            return {
              type: 'bar',
              name: kind,
              x: items.filter((x) => x.kind === kind).map((x) => x[info.x_field]),
              y: items.filter((x) => x.kind === kind).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'services',
        id: 'budget_trend',
        query: `WITH objs AS
        (SELECT :org-field,
                jsonb_array_elements("manualBudget"::JSONB) AS obj
         FROM activities
         WHERE :where AND "manualBudget" IS NOT NULL
           AND "manualBudget" != 'null' )
      SELECT :org-field as "משרד",
             (obj->>'year')::integer as year,
             sum((obj->>'approved')::numeric) as value
      FROM objs
      GROUP BY 1,
               2
      order by 1, 2`,
        title: 'תקציב לאורך זמן',
        x_field: 'year',
        y_field: 'value',
        subtitle: 'התקציב המאושר של השירותים השונים',
        layout: {
        },
        data: (items, info) => {
          const orgs = items.map((x) => x['משרד']).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return orgs.map((org) => {
            return {
              type: 'line',
              name: org,
              x: items.filter((x) => x['משרד'] === org).map((x) => x[info.x_field]),
              y: items.filter((x) => x['משרד'] === org).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'services',
        id: 'supplier_trend',
        query: `WITH objs AS
        (SELECT :org-field,
                jsonb_array_elements(suppliers::JSONB) AS obj
         FROM activities
         WHERE suppliers IS NOT NULL
           AND suppliers != 'null'),
           years AS
        (SELECT :org-field,
                obj->>'entity_id' AS entity_id,
                jsonb_array_elements(obj->'activity_years') AS YEAR
         FROM objs)
      SELECT :org-field as office,
             (YEAR::text)::integer as year,
             count(DISTINCT entity_id) AS value
      FROM years
      where (YEAR::text)::integer >= 2020
      group by 1,2
      ORDER BY 1`,
        title: 'מפעילים לאורך זמן',
        x_field: 'year',
        y_field: 'value',
        subtitle: 'מספר המפעילים בשירותים השונים',
        layout: {
        },
        data: (items, info) => {
          const orgs = items.map((x) => x.office).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return orgs.map((org) => {
            return {
              type: 'line',
              name: org,
              x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
              y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'suppliers',
        id: 'supplier_kinds_budget',
        query: `
      SELECT :org-field as office,
             supplier_kinds,
             sum(current_budget) as value
      FROM activities
      where :where and supplier_kinds is not null
      group by 1,2
      ORDER BY 1`,
        title: 'תקציב שירותים לפי סוג מפעיל',
        x_field: 'office',
        y_field: 'value',
        subtitle: 'תקציב השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return kinds.map((kind) => {
            return {
              type: 'bar',
              name: kind,
              x: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.x_field]),
              y: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'suppliers',
        id: 'supplier_kinds_count',
        query: `
      SELECT :org-field as office,
             supplier_kinds,
             count(1) as value
      FROM activities
      where :where and supplier_kinds is not null
      group by 1,2
      ORDER BY 1`,
        title: 'מס׳ שירותים לפי סוג מפעיל',
        x_field: 'office',
        y_field: 'value',
        subtitle: 'מספר השרותים שניתנים ע״י מפעילים מהמגזרים השונים',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          const kinds = items.map((x) => x.supplier_kinds).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return kinds.map((kind) => {
            return {
              type: 'bar',
              name: kind,
              x: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.x_field]),
              y: items.filter((x) => x.supplier_kinds === kind).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'suppliers',
        id: 'supplier_count_category_budget',
        query: `
      SELECT :org-field as office,
             supplier_count_category,
             sum(current_budget) as value
      FROM activities
      where :where and supplier_count_category is not null
      group by 1,2
      ORDER BY 1`,
        title: 'תקציב שירותים לפי היקף המפעילים',
        x_field: 'office',
        y_field: 'value',
        subtitle: 'תקציב השרותים בחלוקה לכמות המפעילים בשירות',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return kinds.map((kind) => {
            return {
              type: 'bar',
              name: kind,
              x: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.x_field]),
              y: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'suppliers',
        id: 'supplier_count_category_count',
        query: `
      SELECT :org-field as office,
             supplier_count_category,
             sum(current_budget) as value
      FROM activities
      where :where and supplier_count_category is not null
      group by 1,2
      ORDER BY 1`,
        title: 'מס׳ שירותים לפי היקף המפעילים',
        x_field: 'office',
        y_field: 'value',
        subtitle: 'מספר השרותים בחלוקה לכמות המפעילים בשירות',
        layout: {barmode: 'stack'},
        data: (items, info) => {
          const kinds = items.map((x) => x.supplier_count_category).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return kinds.map((kind) => {
            return {
              type: 'bar',
              name: kind,
              x: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.x_field]),
              y: items.filter((x) => x.supplier_count_category === kind).map((x) => x[info.y_field]),
            }
          });
        }
      },
      {
        location: 'suppliers',
        id: 'concentration',
        query: `
      SELECT :org-field as office,
             current_budget,
             jsonb_array_length(suppliers) as num_suppliers
      FROM activities
      where :where and supplier_count_category is not null`,
        title: 'מטריצת ריכוזיות',
        x_field: 'current_budget',
        y_field: 'num_suppliers',
        subtitle: 'כמות המפעילים של השירות יחסית לתקציב השירות',
        layout: {
          xaxis: {
            type: 'log',
            autorange: true
          },
          yaxis: {
            type: 'log',
            autorange: true
          }
        },
        data: (items, info) => {
          const orgs = items.map((x) => x.office).filter((item, i, ar) => ar.indexOf(item) === i).sort();
          return orgs.map((org) => {
            return {
              type: 'scatter',
              mode: 'markers',
              name: org,
              x: items.filter((x) => x.office === org).map((x) => x[info.x_field]),
              y: items.filter((x) => x.office === org).map((x) => x[info.y_field]),
            }
          });
        }
      },
    ];
    public charts = {};

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
        const params = this.processParams(results, field, field === 'target_age_group' || field === 'target_audience');
        this.parameters[field] = params;
        this.filters[field] = 'TRUE';
        if (Object.keys(this.parameters).length === fields.length) {
          this.ready.next();
        }
      });
    }

    ngOnInit() {
      this.item = this.store.item;
      // console.log('ITEM', this.item);
      this.processLevel(this.item);
      // this.item.charts = [];
      // this.ready.pipe(first()).subscribe(() => {
      //   this.item.charts = [
      //     {
      //       title: 'שירותים',
      //       long_title: 'השירותים החברתיים במיקור חוץ',
      //       description: 'מידע נוסף על השירותים החברתיים, התקציב שלהם ומאפיינים נוספים שלהם',
      //       type: 'questions',
      //       label: 'שאילתות<br/>מוכנות',
      //       questions: QuestionParser.processQuestions(this.servicesQuestions(this.item))
      //     },
      //     {
      //       title: 'תקציב',
      //       long_title: 'התקציב המוקצב לשירותים השונים',
      //       description: 'התקציב המאושר והמבוצע לשירותים השונים, כפי שדווח על ידי המשרדים.',
      //     },
      //     {
      //       title: 'מפעילים',
      //       long_title: 'הגופים המפעילים את השירותים השונים',
      //       description: 'מידע נוסף על הספקים או העמותות המפעילות את השירותים החברתיים ומאפיינים נוספים שלהם',
      //     },
      //   ];
      //   this.store.item = this.store.item;
      // });
      this.filtersChanged();
    }

    processParams(records, field, female) {
      const params = [];
      const dflt = female ? 'כלשהי' : 'כלשהו';
      params.push({
        display: dflt,
        value: 'TRUE'
      });
      for (const rec of records) {
        params.push({
          display: rec['name'],
          value: `(${field}::text) LIKE '%%"${rec.name}"%%'`
        })
      }
      return params;
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

    formatter(x, row) {
      return '' + x;
    }

    filtersChanged() {
      let where = '';
      for (const k of Object.keys(this.filters)) {
        where += ` ${this.filters[k]} AND`;
      }
      where += ' ' + this.levelCond;
      where = where.split(' TRUE AND').join('');
      for (const ct of this.chartTemplates) {
        this.refreshChart(ct, where);
      }
    }

    sum(arr): number {
      return arr.reduce(function(a, b){
        return a + b;
      }, 0);
    }

    replaceAll(query, conf) {
      for (const {from, to} of conf) {
        query = query.split(from).join(to);
      }
      return query;
    }

    refreshChart(ct, where) {
      const query = this.replaceAll(
        ct.query,
        [
          {from: ':where', to: where},
          {from: ':org-field', to: this.groupByLvl},
        ]
      );
      this.api.getItemData(
        query, ['משרד', 'value'], [this.formatter, this.formatter]
      ).subscribe((result: any) => {
        const layout = ct.layout;
        layout.margin = {t: 20, l:30};
        layout.height = 400;
        const total = this.sum(result.rows.map((x) => x[ct.y_field])).toLocaleString('he-IL', {maximumFractionDigits: 2});
        ct._subtitle = ct.subtitle.replace(':total', total);
        const data = ct.data(result.rows, ct);
        this.charts[ct.id] = {layout, data};
      });
    }

//     servicesQuestions(item) {
//       const ret = [];
//       ret.push({
//         text: `כל השירותים החברתיים ב${this.item.breadcrumbs} עם אופן התערבות <intervention>, ` +
//               `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
//         query: [
//             `select office as "משרד",
//                     unit as "מנהל",
//                     subunit as "אגף",
//                     subsubunit as "יחידה",
//                     name as "שם השירות",
//                     intervention as "אופני התערבות",
//                     subject as "תחומי התערבות",
//                     target_age_group as "קבוצות גיל",
//                     target_audience as "אוכלוסיות יעד"
//                     from activities
//                     where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}`
//         ],
//         parameters: this.parameters,
//         defaults: this.defaults,
//         headers: [
//           'משרד',
//           'מנהל',
//           'אגף',
//           'יחידה',
//           'שם השירות',
//           'אופני התערבות:comma-separated',
//           'תחומי התערבות:comma-separated',
//           'קבוצות גיל:comma-separated',
//           'אוכלוסיות יעד:comma-separated',
//         ]
//       });
//       ret.push({
//         text: `פילוח השירותים החברתיים ברמה הארגונית עם אופן התערבות <intervention>, ` +
//               `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
//         query: [
//             `select ${this.groupByLvl} as "גוף",
//                     count(1) as "מספר שירותים"
//                     from activities
//                     where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}
//                     group by ${this.groupByLvl} order by 2 desc`
//         ],
//         parameters: this.parameters,
//         defaults: this.defaults,
//         headers: [
//           'גוף',
//           'מספר שירותים',
//         ],
//         graphFormatter: {
//           type: 'bars',
//           x_field: 'גוף',
//           series: [
//             {
//               field: 'מספר שירותים'
//             }
//           ]
//         }
//       });
//       ret.push({
//         text: `פילוח השירותים החברתיים לפי מספר מפעילים עם אופן התערבות <intervention>, ` +
//               `בתחום <subject>, המיועד ל<target_audience> בגיל <target_age_group>`,
//         query: [`
// select ${this.groupByLvl} as "גוף",
//   sum(case when jsonb_typeof(suppliers) != 'array' or jsonb_array_length(suppliers)=0 then 1 else 0 end) as "ללא מפעילים",
//   sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers)=1 then 1 else 0 end) as "מפעיל אחד",
//   sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers) in (2,3,4,5) then 1 else 0 end) as "בין 2 ל-5 מפעילים",
//   sum(case when jsonb_typeof(suppliers) = 'array' and jsonb_array_length(suppliers) >= 6 then 1 else 0 end) as "מעל 6 מפעילים"
//   from activities
//   where :intervention and :subject and :target_age_group and :target_audience and ${this.levelCond}
//   group by ${this.groupByLvl} order by 1 asc`
//         ],
//         parameters: this.parameters,
//         defaults: this.defaults,
//         headers: [
//           'גוף',
//           'ללא מפעילים',
//           'בין 2 ל-5 מפעילים',
//           'מעל 6 מפעילים',
//         ],
//         graphFormatter: {
//           type: 'bars',
//           x_field: 'גוף',
//           series: [
//             {
//               field: 'ללא מפעילים'
//             },
//             {
//               field: 'מפעיל אחד'
//             },
//             {
//               field: 'בין 2 ל-5 מפעילים'
//             },
//             {
//               field: 'מעל 6 מפעילים'
//             }
//           ]
//         }
//       });
//       return ret;
//     }

}
