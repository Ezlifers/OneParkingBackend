import { Component, Input, OnInit } from '@angular/core';
import { GOOGLE_MAP_KEY } from '../../app.settings';

@Component({
    selector: 'app-zone-map',
    template: '<img [class.responsive-img]="responsive" [src]="url">'
})
export class MapComponent implements OnInit {
    @Input() width = 600;
    @Input() height = 300;
    @Input() lat: number;
    @Input() lon: number;
    @Input() zoom = 17;
    @Input() key: number;
    @Input() responsive = true;
    url: string;

    ngOnInit() {
        this.url = `https://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_MAP_KEY}
        &center=${this.lat},${this.lon}&zoom=${this.zoom}&size=${this.width}x${this.height}&maptype=roadmap
        &markers=color:blue%7Clabel:P%7C${this.lat},${this.lon}`;
    }
}
