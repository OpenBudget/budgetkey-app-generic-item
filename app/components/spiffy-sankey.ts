import {Component, ViewChild, ElementRef, Input} from '@angular/core';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-spiffy-sankey',
  template: `
    <div style="direction: ltr" #plot>
    </div>
  `
})
export class SpiffySankeyComponent {

  @Input() public chart: any;

  @ViewChild('plot') plot: ElementRef;

  ngOnInit() {

    let fig = {data:[this.chart]};
    console.log('FFF', fig);
    let labels = [];
    if (!!window.chrome) {
      for (let label of fig.data[0].node.label) {
        labels.push(label.split("").reverse().join(""));
      }
    }

    let data_ = {
      type: "sankey",
      domain: {
        x: [0,1],
        y: [0,1]
      },
      orientation: "h",
      valueformat: ",.0f",
      // valuesuffix: "TWh",
      node: {
        pad: 15,
        thickness: 15,
        line: {
          color: "black",
          width: 0.5
        },
        label: fig.data[0].node.label,
        color: fig.data[0].node.color
      },

      link: {
        source: fig.data[0].link.source,
        target: fig.data[0].link.target,
        value: fig.data[0].link.value,
        label: fig.data[0].link.label
      }
    };

    let data = [data_];

    let layout = {
      // title: "Energy forecast for 2050\n" +
      // "Source: Department of Energy & Climate Change, Tom Counsell via Mike Bostock",
      // width: 1118,
      height: 772,
      font: {
        size: 10
      }
    };

    Plotly.plot(this.plot.nativeElement, data, layout);
    // const data: any = [
    //   {
    //     x: ['giraffes', 'orangutans', 'monkeys'],
    //     y: [20, 14, 23],
    //     type: 'bar'
    //   }
    // ];
    // Plotly.newPlot(this.plot.nativeElement, data);
  }
}
