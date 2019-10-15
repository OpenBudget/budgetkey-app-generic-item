import { Component, Input, OnInit } from '@angular/core';

import { hierarchy, pack } from 'd3-hierarchy';

@Component({
  selector: 'budgetkey-chart-pointatron',
  template: `
<div class='pointatron-container'>
  <div *ngFor="let root of roots" class="pointatron">
    <div class='svg-container'>
      <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200" [attr.width]="200 / root.scale" [attr.height]="200 / root.scale" version="1.1" *ngIf='root.children'>
        <circle [attr.cx]="c.x" [attr.cy]="c.y" [attr.r]="root.radius"
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

@media only screen and (max-width: 600px) {
  .pointatron-container {
    flex-flow: column;
    align-items: center;
  }

  .pointatron {
    padding: 20px 0;
  }
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

circle {
  stroke: white;
  stroke-width: 1;
}
    `
  ]
})
export class PointatronChartComponent implements OnInit {

  @Input() public data: any;

  roots: any[] = [];
  MAX_RADIUS = 5;
  MAX_AMOUNT = 2500;

  constructor() {}

  ngOnInit() {
    for (const v of this.data.values) {
      let amount = v.amount;
      if (amount > this.MAX_AMOUNT) {
        amount = this.MAX_AMOUNT;
      }
      let root = {
        title: v.title,
        amount: v.amount,
        color: v.color,
      };
      if (amount > 0) {
        const nodes: any = [];
        for (let i = 0 ; i < amount ; i ++) {
          nodes.push({value: 0.75 + 0.5 * Math.random(), i: i});
        }
        const root_ = {
          children: nodes
        };
        const root__ = hierarchy(root_);
        root__.sum((d: any) => d.value).sort((a: any, b: any) => b.value - a.value);
        const layout = pack().size([200, 200]);
        layout(root);
        const radius = root__.children[root__.children.length - 1]['r'];
        root__.sort((a: any, b: any) => b.i - a.i);
        layout(root__);
        let scale = 1;
        if (radius > this.MAX_RADIUS) {
          scale = radius / this.MAX_RADIUS;
        }
        root = Object.assign(root, root__);
        root['radius'] = radius;
        root['scale'] = scale;
      }
      this.roots.push(root);
    }
  }

}
