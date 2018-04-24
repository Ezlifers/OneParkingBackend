import { Component, OnInit } from '@angular/core';
import { SupervisorService, SupervisorSelectedService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-supervisor-activities',
    templateUrl: './supervisor-activities.component.html'
})
export class SupervisorActivitiesComponent implements OnInit {

    searched: boolean;
    loading: boolean;

    dateIni: string;

    constructor(private service: SupervisorService, public selected: SupervisorSelectedService) { }

    ngOnInit() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const m = month > 10 ? `0${month}` : `${month}`;
        const d = day > 0 ? `0${day}` : `${day}`;
        this.dateIni = `${year}-${m}-${d}`;
    }

    search(q: string) {
        this.loading = true;
        const from = Date.parse(q);
        /*this.service.getLoc(this.selected.aux._id, from)
            .subscribe(
            res => this.searchEnded(res, true),
            err => this.searchEnded([], false)
            );*/
    }

    searchEnded(data, success: boolean) {
        this.loading = false;
        if (success) {
            this.searched = true;
        } else {
            this.searched = false;
            Materialize.toast('Error al obtener los registros de actividad', 4000)
        }
    }

    keyUp(e: any, q: string) {
        if (e.keyCode === 13) {
            this.search(q);
        }
    }


}
