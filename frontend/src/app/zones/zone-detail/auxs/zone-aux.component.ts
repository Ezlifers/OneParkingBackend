import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ZoneAux, ScheduleAux, Aux, AuxService } from '../../../auxs/+shared/_index';
import { ZoneService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-zone-aux',
    templateUrl: './zone-aux.component.html'
})
export class ZoneAuxComponent implements OnInit {

    @Input() zone: ZoneAux;
    @Input() schedule: ScheduleAux;
    @Input() aux: Aux;
    @Input() index: number;
    @Input() aIndex: number;

    @Output() auxDeleted = new EventEmitter<number>();

    days: boolean[];

    constructor(public service: AuxService) {
        this.days = [false, false, false, false, false, false, false];
    }

    ngOnInit() {
        this.schedule.dias.forEach((d) => this.days[d] = true);
    }

    remove() {
        if (this.zone.horarios.length > 1) {
            this.service.removeSchedule(this.aux._id, this.zone.id, this.schedule)
                .subscribe(
                res => this.removed(res),
                err => this.removed(false)
                );
        } else {
            this.service.removeZone(this.aux._id, this.zone.id)
                .subscribe(
                res => this.removed(res),
                err => this.removed(false)
                );
        }
    }

    removed(success: boolean) {
        if (!success) {
            Materialize.toast('Error al eliminar horario', 4000);
            return;
        }
        if (this.zone.horarios.length > 1) {
            this.zone.horarios.splice(this.index, 1);
        } else {
            this.auxDeleted.emit(this.aIndex);
        }
        Materialize.toast('horario eliminado', 4000);
    }

}
