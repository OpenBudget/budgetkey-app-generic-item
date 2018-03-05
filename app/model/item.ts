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
  details: object;
  charts: Chart[];
  theme_id: string | null = null;
}
