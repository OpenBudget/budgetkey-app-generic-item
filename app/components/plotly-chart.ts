import {Component, ViewChild, ElementRef, Input} from '@angular/core';

declare const Plotly: any;
declare const window: any;

@Component({
  selector: 'budgetkey-plotly-chart',
  template: `
    <div style="direction: ltr" #plot>
    </div>
  `
})
export class PlotlyChartComponent {

  @Input() public data: any;
  @Input() public layout: any;

  @ViewChild('plot') plot: ElementRef;

  ngOnInit() {

    let traces: any = this.data;
    console.log('FFF', traces);
    let labels = null;
    if (traces[0].type == 'sankey') {
      labels = [];
      if (!!window.chrome) {
        if (!traces[0].node._orig_label) {
          traces[0].node._orig_label = traces[0].node.label;
          for (let label of traces[0].node._orig_label) {
            labels.push(label.split('').reverse().join(''));
          }
          traces[0].node.label = labels;
        }
      }
    }

    // let data_ = {
    //   type: 'sankey',
    //   domain: {
    //     x: [0, 1],
    //     y: [0, 1]
    //   },
    //   orientation: 'h',
    //   valueformat: ',.0f',
    //   // valuesuffix: 'TWh',
    //   node: {
    //     pad: 15,
    //     thickness: 15,
    //     line: {
    //       color: 'black',
    //       width: 0.5
    //     },
    //     label: labels,
    //     color: fig.data[0].node.color
    //   },
    //
    //   link: {
    //     source: traces[0].link.source,
    //     target: traces[0].link.target,
    //     value: traces[0].link.value,
    //     label: traces[0].link.label
    //   }
    // };
    //
    // let data = [data_];

    let layout = Object.assign({
      // title: "Energy forecast for 2050\n" +
      // "Source: Department of Energy & Climate Change, Tom Counsell via Mike Bostock",
      // width: 1118,
      height: 600,
      font: {
        size: 10
      }
    }, this.layout);

    Plotly.plot(this.plot.nativeElement, traces, layout);
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
