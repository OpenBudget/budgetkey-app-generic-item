import {Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'timeline-part',
    template: `
<div class='timeline-part'
     [style.height]="size + 'px'"
     [style.width]="size + 'px'">
    <svg [attr.height]="(size + padding) + 'px'"
         [attr.width]="size + 'px'">
        <path *ngIf='!last'
              class='connector'
              [attr.d]='path()'>
        </path>
        <circle [attr.cx]='size/2'
                [attr.cy]='size/2'
                [attr.r]='radius'
                [style.fill]='fill'
                [style.stroke]='stroke'
                [style.stroke-width]='strokeWidth'
                >
        </circle>
        <path *ngIf='percent'
              class='arc'
              [attr.d]="arc()"
              [style.stroke]='stroke'
              [style.fill]='stroke'>
        </path>
    </svg>
</div>`,
    styles: [
    `
.timeline-part {
    position: relative;
    overflow: visible;
    top: -1px;
}
svg {
    position: absolute;
    top: 0px;
    left: 0px;
}
circle {
    stroke-width: 2;
}
path.connector {
    stroke: rgba(81,44,10,0.5);
    stroke-width: 2;
}
path.arc {
    stroke-width: 0;
}
`
    ]
})
export class TimelinePartComponent implements OnInit {
    @Input() size: number;
    @Input() padding: number;
    @Input() major: boolean;
    @Input() last: boolean;
    @Input() percent: number;

    radius: number;
    fill: string;
    stroke: string;
    strokeWidth: number;

    ngOnInit() {
        if (this.major) {
            this.radius = (this.size - 2) / 2;
            this.fill = '#FFFBF2';
            this.stroke = '#512C0A';
            this.strokeWidth = this.radius > 10 ? 2 : 1;
        } else {
            this.radius = 5;
            this.fill = '#D3C7B8';
            this.stroke = 'none';
            this.strokeWidth = 0;
        }
    }

    path() {
        const x = this.size / 2;
        const y = this.size;
        return `M${x},${y}L${x},${y + this.padding}`;
    }

    arc() {
        const rad = Math.PI * this.percent / 50;
        const large = this.percent >= 50 ? 1 : 0;
        const c = this.size / 2;
        let d = `M ${c} ${c - this.radius} `;
        d += `A ${this.radius} ${this.radius} 0 ${large} 1 `;
        const endX = c + this.radius * Math.sin(rad);
        const endY = c - this.radius * Math.cos(rad);
        d += `${endX} ${endY} `;
        d += `L ${c} ${c}`;
        return d;
    }
}
