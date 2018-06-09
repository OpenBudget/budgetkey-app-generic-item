import {Component, Input } from '@angular/core';

@Component({
    selector: 'timeline-part',
    template: `
<div class='timeline-part'
     [style.height]="size + 'px'"
     [style.width]="size + 'px'">
    <svg [attr.height]="(size + padding) + 'px'"
         [attr.width]="size + 'px'">
         <path *ngIf='!last' [attr.d]='path()'>
         </path>
         <circle [attr.cx]='size/2' 
                 [attr.cy]='size/2' 
                 [attr.r]='radius'
                 [style.fill]='fill'
                 [style.stroke]='stroke'>
         </circle>
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
path {
    stroke: rgba(81,44,10,0.5);
    stroke-width: 2;
}
`
    ]
})
export class TimelinePartComponent {
    @Input() size: number;
    @Input() padding: number;
    @Input() major: boolean;
    @Input() last: boolean;

    radius: number;
    fill: string;
    stroke: string;

    ngOnInit() {
        if (this.major) {
            this.radius = (this.size - 2) / 2;
            this.fill = '#FFFBF2';
            this.stroke = '#512C0A';
        } else {
            this.radius = 5;
            this.fill = '#D3C7B8';
            this.stroke = 'none';
        }
    }

    path() {
        let x = this.size / 2;
        let y = this.size;
        return `M${x},${y}L${x},${y + this.padding}`;
    }
}
