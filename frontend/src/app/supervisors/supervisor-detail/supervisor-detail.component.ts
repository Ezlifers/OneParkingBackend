import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupervisorService, Supervisor, SupervisorSelectedService } from '../+shared/_index';

declare var Materialize: any;
declare var $: any;

@Component({
    templateUrl: './supervisor-detail.component.html'
})
export class SupervisorDetailComponent implements OnInit {

    desEditing = false;

    constructor(private router: Router
    , private route: ActivatedRoute
    , private selected: SupervisorSelectedService
    , private service: SupervisorService
    ) { }

    ngOnInit() {
        $('.modal').modal();
        setTimeout(() => $('ul.tabs').tabs(), 40);
    }

    deleteDialog() {
        $('#deleteDialog').modal('open');
    }

    deleteSupervisor() {
        this.service.deleteSupervisor(this.selected.supervisor._id).subscribe(res => this.deleted(res), err => this.deleted(false));
    }

    deleted(success: boolean) {
        if (!success) {
            Materialize.toast('Error al eliminar el Supervisor', 4000);
            return;
        }
        Materialize.toast('Supervisor eliminado', 4000);
        this.router.navigate(['../'], { relativeTo: this.route });
    }

}
