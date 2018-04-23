import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Incident, IncidentService } from '../+shared/_index';

declare var $: any;
declare var Materialize: any;

@Component({
    selector: 'app-incident',
    templateUrl: './incident.component.html'
})
export class IncidentComponent implements OnInit {

    @Input() incident: Incident;
    @Input() index: number;
    @Output() attended: EventEmitter<number> = new EventEmitter<number>();

    inZoom: boolean;

    dateNotify: number;
    dateAttend: number;

    loading: boolean;

    constructor(private service: IncidentService) { }

    ngOnInit() {
        $('.materialboxed').materialbox();
        this.inZoom = false;
        this.dateNotify = Date.parse(`${this.incident.fecha}`);
        this.dateAttend = this.incident.atendida ? Date.parse(`${this.incident.fechaAtencion}`) : null;
    }

    zoom() {
        this.inZoom = !this.inZoom;
    }

    attend() {
        this.loading = true;
        this.service.attendIncident(this.incident._id).subscribe(
            success => this.processAttend(true), err => this.processAttend(false)
        );
    }

    processAttend(success: boolean) {
        this.loading = false;
        if (!success) {
            Materialize.toast('Error al atender incidencia', 4000);
            return;
        }
        Materialize.toast('Incidencia marcada como atendida', 4000)
        this.attended.emit(this.index);
    }
}
