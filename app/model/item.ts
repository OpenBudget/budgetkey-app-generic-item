class Chart {
  title: string;
  chart: object;
  layout: object;
}


export class Item {
  id: string | number = '';
  kind = '';
  received_amount: string | number = 0;
  name = '';
  score = 0;
  details: object;
  charts: Chart[];
}
