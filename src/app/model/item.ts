class Chart {
  title: string;
  chart: object;
  layout: object;
}


export class Item {
  id: string | number = '';
  kind: string = '';
  received_amount: string | number = 0;
  name: string = '';
  score: number = 0;
  details: any;
  charts: Chart[];

  page_title?: string;

  simple_decision?: string;
  tender_type?: string;
  simple_decision_long?: string;
  purpose?: string;
  purchase_method?: string;
  budget_code?: string;
  awardees_text?: string;
  awardees?: any;
  contact?: string;
  page_url?: string;
  contract_volume?: number;
  timeline?: any;
  documents?: any;
  payments?: any;
  subject_list_keywords?: string[];


}
