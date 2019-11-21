import {Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'timeline-part',
    template: `
<div class='timeline-part'>
    <div *ngIf='!first'
        class='connector'
        [style.height]='sanitizer.bypassSecurityTrustStyle("calc(50% - " + size/2 + "px)")'
        [style.top]='0'>
    </div>
    <div *ngIf='!last'
        class='connector'
        [style.height]='sanitizer.bypassSecurityTrustStyle("calc(50% + " + (padding - size/2) + "px)")'
        [style.top]='sanitizer.bypassSecurityTrustStyle("calc(50% + " + size/2 + "px)")'>
    </div>
    <svg [attr.height]="size + 'px'"
         [attr.width]="size + 'px'">
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
:host {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
}
.timeline-part {
    position: relative;
    overflow: visible;
    height: 100%;
    width: auto;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
}
svg {
}
circle {
    stroke-width: 2;
}
div.connector {
    position: absolute;
    top: 50%;
    width: 0px;
    border: 1px solid rgba(81,44,10,0.5);
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
    @Input() first: boolean;
    @Input() last: boolean;
    @Input() percent: number;

    radius: number;
    fill: string;
    bg: string;
    stroke: string;
    strokeWidth: number;

    constructor(public sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.bg = '#FFFBF2';
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
