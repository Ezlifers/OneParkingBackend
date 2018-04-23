import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Config } from '../../+shared/_index';
import { TimeDescription } from '../../../zones/+shared/_index';

declare var $: any;

@Component({
    selector: 'app-config-sc',
    templateUrl: './config-edit-shedule.component.html'
})
export class ConfigEditSheduleComponent implements OnInit {

    @Input() config: Config;
    @Output() scheduleDeleted = new EventEmitter<boolean>();

    titleDialog: string;
    addPos: number;
    addTi: string;
    addTf: string;
    addDis: boolean;

    price: number;
    pricePos: number;
    priceH: number;

    ngOnInit() {
        $('.modal').modal();
    }

    showDialog(title: string, pos: number) {
        this.titleDialog = title;
        this.addPos = pos;
        this.addDis = true;
        this.addTi = '';
        this.addTf = '';
        $('#addDialog').modal('open');
    }

    changeDis(checked: boolean) {
        this.addDis = checked;
    }

    addTime() {
        const tiempo: TimeDescription = {
            d: this.addDis,
            ti: this.convertTime(this.addTi),
            tf: this.convertTime(this.addTf)
        };
        this.config.tiempos[this.addPos].horarios.push(tiempo);
        this.config.tiempos[this.addPos].horarios.sort((a, b) => {
            return a.ti - b.ti;
        });
    }

    convertTime(time: string) {
        const t: string[] = time.split(':');
        const h: number = parseInt(t[0], 10);
        const m: number = parseInt(t[1], 10);
        return (h * 60) + m;
    }

    changeAvailability(time: number, schedule: number, checked: boolean) {
        this.config.tiempos[time].horarios[schedule].d = checked;
    }


    removeTime(pos: number, h: number) {
        this.scheduleDeleted.emit(true);
        this.config.tiempos[pos].horarios.splice(h, 1);
    }
}
