import { Component, Input, OnInit } from '@angular/core';
import { ScheduleAux, ZoneAux, AuxSelectedService, AuxService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-aux-zone',
    templateUrl: './aux-zone.component.html'
})
export class AuxZoneComponent implements OnInit {

    @Input() schedule: ScheduleAux;
    @Input() zone: ZoneAux;
    @Input() sIndex: number;
    @Input() zIndex: number;

    days: boolean[];

    constructor(private selected: AuxSelectedService, private service: AuxService) {
        this.days = [false, false, false, false, false, false, false];
    }

    ngOnInit() {
        this.schedule.dias.forEach((d) => this.days[d] = true);
    }

    remove() {
        if (this.zone.horarios.length > 1) {
            this.service.removeSchedule(this.selected.aux._id, this.zone.id, this.schedule)
                .subscribe(
                res => this.removed(res),
                err => this.removed(false)
                );
        } else {
            this.service.removeZone(this.selected.aux._id, this.zone.id)
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
            this.selected.aux.zonas[this.zIndex].horarios.splice(this.sIndex, 1);
        } else {
            this.selected.aux.zonas.splice(this.zIndex, 1);
        }

        Materialize.toast('Horario eliminado', 4000);
    }
}
