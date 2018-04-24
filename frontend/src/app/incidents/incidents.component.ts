import { Component, OnInit } from '@angular/core';
import { Incident, IncidentService } from './+shared/_index';
import { NavigationService } from '../+core/_index';

declare var $: any;
declare var Materialize: any;

@Component({
    templateUrl: './incidents.component.html'
})
export class IncidentsComponent implements OnInit {

    incidents: Incident[];
    findToday: boolean;
    dateFrom: string;
    dateTo: string;
    all: boolean;

    loading: boolean;
    searched: boolean;

    constructor(public service: IncidentService, public nav: NavigationService) {
        this.nav.title = 'Incidencias';
        this.findToday = true;
        this.loading = false;
        this.searched = false;
        this.all = false;
        this.dateTo = null;
    }

    ngOnInit() {
        this.getToday();
        this.loadIncidents();
    }

    refresh() {
        this.loadIncidents();
    }

    removeIncident(index: number) {
        this.incidents.splice(index, 1);
    }

    changeToday(state: boolean) {
        this.findToday = state;
        if (state) {
            this.getToday();
            this.dateTo = null;
            this.loadIncidents();
        } else {
            this.searched = false;
        }
    }

    changeAttend(state: boolean) {
        this.all = state;
        this.loadIncidents();
    }

    keyUp(e: any) {
        if (e.keyCode === 13 && !this.loading) {
            this.loadIncidents();
        }
    }

    search() {
        this.loadIncidents();
    }

    private loadIncidents() {
        this.loading = true;
        this.incidents = [];
        this.service.getIncidents(this.dateFrom, this.dateTo, this.all)
            .subscribe(data => this.processIncidents(true, data), err => this.processIncidents(false, []));
    }

    private processIncidents(success: boolean, data: Incident[]) {
        this.searched = true;
        this.loading = false;
        if (!success) {
            Materialize.toast('Error al leer incidencias', 4000);
            return;
        }
        this.incidents = data;
    }

    private getToday() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const m = month > 10 ? `0${month}` : `${month}`;
        const d = month > 10 ? `0${day}` : `${day}`;
        this.dateFrom = `${year}-${m}-${d}`;
    }


}
