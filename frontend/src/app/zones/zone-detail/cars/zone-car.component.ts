import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Car, ZoneService } from '../../+shared/_index';

declare var Materialize: any;
const alarmTime = 300;

@Component({
    selector: 'app-zone-car',
    templateUrl: './zone-car.component.html'
})
export class ZoneCarComponent implements OnInit, OnDestroy {

    @Input() car: Car;
    @Input() timeComplete;
    @Input() index: number;
    @Output() finish = new EventEmitter<number>();

    alarm: boolean;
    time: number;
    interval: any;

    constructor() {
        this.alarm = false;
    }

    ngOnInit() {
        this.calculateTime();
        this.interval = setInterval(() => this.calculateTime(), 30000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    calculateTime() {
        const now = Date.now() / 1000;
        const timeOut: number = this.timeComplete - now;
        if (timeOut > 0) {
            this.time = parseInt(`${timeOut / 60}`, 10) + 1;
            if (timeOut <= alarmTime) {
                this.alarm = true;
            }
        } else {
            this.finish.emit(this.index);
        }
    }
}
