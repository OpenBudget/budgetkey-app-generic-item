import { Component, OnInit } from '@angular/core';
import { BudgetKeyItemService } from '../../../services';

import { StoreService } from '../../../services/store';

import { tableDefs } from './tables';

@Component({
    selector: 'social-service-item',
    templateUrl: `./social-service-item.html`,
    styleUrls: [`./social-service-item.less`]
})
export class SocialServiceItemComponent implements OnInit {

  item: any;
  budget_chart: any;
  beneficiary_chart: any;
  tables = tableDefs;
  replacements: any[] = [];
  supplierRegions = {};
  REGIONS = [
    'ארצי',
    'מרכז',
    'צפון',
    'דרום',
    'ירושלים ויו"ש'
  ];

  constructor(private store: StoreService, private api: BudgetKeyItemService) {
  }

  ngOnInit() {
    this.item = this.store.item;
    this.replacements = [
      {from: ':where', to: `id = '${this.item.id}'`}
    ];
    this.item.breadcrumbs = [this.item.office, this.item.unit, this.item.subunit, this.item.subsubunit].filter(x => !!x).join(' / ');
    this.item.catalog_number = parseInt(this.item.catalog_number, 10) || null;
    // console.log('ITEM=', this.item);
    const budget = this.item.manualBudget.sort((a, b) => a.year - b.year);
    const beneficiaries = this.item.beneficiaries.sort((a, b) => a.year - b.year);
    this.budget_chart = {
      layout: {
        margin: {t: 20, r:40},
        height: 400,
        yaxis: {
          rangemode: 'tozero',
          title: '(₪) תקציב השירות',
        },
        xaxis: {
          dtick: 1,
          title: 'שנת התקציב'
        }
      },
      data: [{
        type: 'line',
        line: {
          dash: 'dot',
        },
        marker: {
          color: '#87cefa',
          opacity: 1,
          line: {
            color: '#87cefa',
            opacity: 1
          }
        },
        name: 'תקציב מאושר',
        x: budget.map(x => x.year),
        y: budget.map(x => x.approved),
      }, {
        type: 'line',
        line: {
          dash: 'dot',
        },
        marker: {
          color: '#ff9900',
          opacity: 1,
          line: {
            color: '#ff9900',
            opacity: 1
          }
        },
        name: 'ביצוע בפועל',
        x: budget.map(x => x.year),
        y: budget.map(x => x.executed),
      }]
    };
    this.beneficiary_chart = {
      layout: {
        margin: {t: 20, r:40},
        height: 400,
        yaxis: {
          rangemode: 'tozero',
          title: 'מספר מוטבים',
        },
        xaxis: {
          dtick: 1,
          title: 'שנה',
        }
      },
      data: [{
        type: 'line',
        marker: {
          color: '#6661d1',
          opacity: 1,
          line: {
            color: '#6661d1',
            opacity: 1
          }
        },
        x: beneficiaries.map(x => x.year),
        y: beneficiaries.map(x => x.num_beneficiaries),
      }]
    };
    this.analyzeSupplierGeo();
  }

  analyzeSupplierGeo() {
    for (const supplier of this.item.suppliers) {
      if (supplier.geo) {
        for (const geo of supplier.geo) {
          this.supplierRegions[geo] = this.supplierRegions[geo] || {count: 0, suppliers: []};
          this.supplierRegions[geo].count++;
          this.supplierRegions[geo].suppliers.push(supplier.entity_name);
        }
      }
    }
  }

  titleForRegion(region) {
    if (this.supplierRegions[region]) {
      const sr = this.supplierRegions[region];
      const count = sr.count === 1 ? 'מפעיל אחד' : `${sr.count} מפעילים`; 
      const suppliers = (sr.suppliers as string[]).map(x => `- ${x}`).join('\n');
      return `${region} - ${count}\n${suppliers}`;
    }
    return '';
  }
  

  mapFillFor(region) {
    let opacity = 0;
    let count = ((this.supplierRegions['ארצי'] || {}).count || 0);
    if (this.supplierRegions[region]) {
      count += this.supplierRegions[region].count;
    }
    if (count === 1) {
      opacity = 30;
    }
    else if (count < 5) {
      opacity = 60;
    }
    else if (count > 5) {
      opacity = 90;
    }
    return `hsla(218, 44%, 58%, ${opacity}%)`;
  }
}
