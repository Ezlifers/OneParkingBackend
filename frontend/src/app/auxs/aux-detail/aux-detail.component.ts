import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuxService, Aux, AuxSelectedService } from '../+shared/_index';

declare var Materialize: any;
declare var $: any;

@Component({
    templateUrl: './aux-detail.component.html'
})
export class AuxDetailComponent implements OnInit {

    desEditing = false;

    constructor(private router: Router
        , private route: ActivatedRoute
        , private selected: AuxSelectedService
        , private service: AuxService) { }

    ngOnInit() {
        $('.modal').modal();
        setTimeout(() => $('ul.tabs').tabs(), 40);
    }

    deleteDialog() {
        $('#deleteDialog').modal('open');
    }

    deleteAux() {
        this.service.deleteAux(this.selected.aux._id).subscribe(res => this.deleted(res), err => this.deleted(false));
    }

    deleted(success: boolean) {
        if (!success) {
            Materialize.toast('Error al eliminar el Auxiliar', 4000);
            return;
        }
        Materialize.toast('Auxiliar eliminado', 4000);
        this.router.navigate(['../'], { relativeTo: this.route });
    }

}
