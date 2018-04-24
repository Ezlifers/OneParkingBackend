import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Supervisor, SupervisorSelectedService, SupervisorService } from '../+shared/_index';
import { NavigationService } from '../../+core/_index';

declare var Materialize: any;

@Component({
    templateUrl: './supervisor-list.component.html'
})
export class SupervisorListComponent implements AfterViewInit {

    supervisors: Supervisor[] = [];

    constructor(private router: Router
        , private route: ActivatedRoute
        , private nav: NavigationService
        , private service: SupervisorService
        , private selected: SupervisorSelectedService) { }

    ngAfterViewInit() {
        this.nav.loading = true;
        this.service.getSupervisors(true).subscribe(data => this.loadSupervisors(data, false), error => this.loadSupervisors(null, true));
    }

    loadSupervisors(data: Supervisor[], err: boolean) {
        this.nav.loading = false;
        if (err) {
            Materialize.toast('Error al leer supervisores', 4000);
            return;
        }
        this.supervisors = data;
    }

    goToAdd() {
        this.router.navigate(['add'], { relativeTo: this.route });
    }

    goToSupervisor(supervisor: Supervisor) {
        this.selected.supervisor = supervisor;
        this.router.navigate(['./' + supervisor._id], { relativeTo: this.route });
    }

}
