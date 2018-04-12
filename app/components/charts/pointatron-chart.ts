import { Component, Input } from '@angular/core';

import { hierarchy, pack } from 'd3-hierarchy';

@Component({
  selector: 'budgetkey-chart-pointatron',
  template: `
<div class='pointatron-container'>
  <div *ngFor="let root of roots" class="pointatron">
    <div class='svg-container'>
      <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200" [attr.width]="200 / root.scale" [attr.height]="200 / root.scale" version="1.1">
        <circle [attr.cx]="c.x" [attr.cy]="c.y" [attr.r]="root.radius" style="stroke:white; stroke-width: 1"
                [style.fill]="root.color" *ngFor="let c of root.children"/>
      </svg>
    </div>
    <div class="title">
      {{ root.title }}
    </div>
    <div class="amount" [style.color]="root.color">
      {{ root.amount }}
    </div>
  </div>
</div>
  `,
  styles: [
    `
.pointatron-container {
  display: flex;
  justify-content: center;
}

.pointatron {
  display: inline-block;
  text-align: center;
  width: 400px;
}

.svg-container {
  display: inline-block;  
  line-height: 200px;
}

svg {
  vertical-align: middle;
}

.title {
  font-family: "Abraham TRIAL";	
  font-size: 14px;	
  line-height: 24px;
}

.amount {
  font-family: "Miriam Libre";	
  font-size: 20px;	
  font-weight: bold;	
  line-height: 26px;
}
    `
  ]
})
export class PointatronChartComponent {

  @Input() public data: any;

  roots: any[] = [];
  MAX_RADIUS = 5;
  MAX_AMOUNT = 2500;

  constructor() {}

  ngOnInit() {
    for (let v of this.data.values) {
      let amount = v.amount;
      if (amount > this.MAX_AMOUNT) {
        amount = this.MAX_AMOUNT;
      }
      let nodes: any = [];
      for (let i = 0 ; i < amount ; i ++) {
        nodes.push({value: 0.75 + 0.5 * Math.random(), i: i});
      }
      let root_ = {
        children: nodes
      };
      let root = hierarchy(root_);
      root.sum((d: any) => d.value).sort((a: any, b: any) => b.value - a.value);
      let layout = pack().size([200, 200]);
      layout(root);
      let radius = root.children[root.children.length - 1]['r'];
      root.sort((a: any, b: any) => b.i - a.i);
      layout(root);
      let scale = 1;
      if (radius > this.MAX_RADIUS) {
        scale = radius / this.MAX_RADIUS;
      }
      root['radius'] = radius;
      root['scale'] = scale;
      root['color'] = v.color;
      root['title'] = v.title;
      root['amount'] = v.amount;
      this.roots.push(root);
    }
  }

}
