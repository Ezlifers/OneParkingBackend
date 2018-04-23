import { Component, Input, OnInit } from '@angular/core';
import { Zone, ZoneService, TimeDescription, TimeRange } from '../../+shared/_index';
import { ZoneConfService } from '../zone-conf.service';
import { Config as DefaultConfig } from '../../../config/+shared/_index';

declare var Materialize: any;
declare var $: any;

@Component({
    selector: 'app-zone-sc',
    templateUrl: './zone-conf-shedule.component.html'
})
export class ZoneConfSheduleComponent implements OnInit {

    @Input() zone: Zone;

    dTimesIni: boolean;
    dTimes: boolean;
    times: TimeRange[];

    titleDialog: string;
    addPos: number;
    addTi: string;
    addTf: string;

    defaultConfig: DefaultConfig;
    scheduleDeleted: boolean;

    constructor(private configService: ZoneConfService, private service: ZoneService) {
        this.defaultConfig = configService.config;
    }

    ngOnInit() {
        $('.modal').modal();
        this.dTimesIni = this.zone.defaultTiempos;
        this.dTimes = this.zone.defaultTiempos;
        this.times = this.zone.tiempos;
    }

    restore() {
        this.scheduleDeleted = false;
        this.dTimesIni = !this.zone.defaultTiempos;
        this.dTimes = this.zone.defaultTiempos;
        setTimeout(() => this.dTimesIni = !this.dTimesIni, 20);
    }

    change(checked: boolean) {
        this.dTimes = checked;
        if (this.dTimes) {
            this.times = this.defaultConfig.tiempos;
        } else if (this.dTimesIni) {
            this.times = [
                { tipo: 'Lunes-Viernes', horarios: [] }, { tipo: 'Sabado', horarios: [] }, { tipo: 'Domingo', horarios: [] }
            ];
        } else {
            this.times = this.zone.tiempos;
        }

    }

    showDialog(title: string, pos: number) {
        this.titleDialog = title;
        this.addPos = pos;
        this.addTi = '';
        this.addTf = '';
        $('#addDialog').modal('open');
    }

    addTime() {
        $('#addDialog').modal('close');
        const time: TimeDescription = {
            d: true,
            ti: this.convertTime(this.addTi),
            tf: this.convertTime(this.addTf)
        };
        this.times[this.addPos].horarios.push(time);

        this.times[this.addPos].horarios.sort((a, b) => {
            return a.ti - b.ti;
        });
    }

    convertTime(time: string) {
        const t: string[] = time.split(':');
        const h: number = parseInt(t[0], 10);
        const m: number = parseInt(t[1], 10);
        return (h * 60) + m;
    }

    removeTime(pos: number, h: number) {
        this.scheduleDeleted = true;
        this.times[pos].horarios.splice(h, 1);
    }

    save() {
        if (this.dTimes !== this.zone.defaultTiempos || this.scheduleDeleted) {
            $('#changeAllSchedule').modal('open');
        } else {
            this.updateSchedules();
        }
    }

    updateSchedules() {
        this.service.updateTimeShedule(this.zone._id, this.dTimes, this.times)
            .subscribe(res => this.success()
            , err => Materialize.toast('Error al actualizar el horario', 4000));
    }

    success() {
        this.zone.defaultTiempos = this.dTimes;
        this.zone.tiempos = this.times;
        Materialize.toast('Horario Actualizado', 4000);
    }

    changeAvailability(time: number, schedule: number, checked: boolean) {
        this.times[time].horarios[schedule].d = checked;
    }


    deleteAuxs() {
        this.service.removeAllAux(this.zone._id).subscribe(res => {
            if (!res) {
                Materialize.toast('Error al actualizar el horario', 4000);
                return;
            }
            this.service.auxs = [];
            this.updateSchedules();
        }, err => Materialize.toast('Error al actualizar el horario', 4000));
    }
}
