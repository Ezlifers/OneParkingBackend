import { Component, OnInit } from '@angular/core';
import { SupervisorService, SupervisorSelectedService, AuxSupervisor } from '../../+shared/_index';
import { Aux } from '../../../auxs/+shared/_index';

declare var $: any;
declare var Materialize: any;

@Component({
    selector: 'app-supervisor-assign',
    templateUrl: './supervisor-assign.component.html'
})
export class SupervisorAssignComponent implements OnInit {

    searched: boolean;
    loading: boolean;
    auxs: Aux[];
    auxA: AuxSupervisor;

    aux: Aux;

    constructor(private service: SupervisorService, public selected: SupervisorSelectedService) {
        this.searched = false;
        this.loading = false;
        this.auxs = [];
    }

    ngOnInit() {
        $('.modal').modal();
    }

    search(q: string) {
        this.loading = true;
        this.searched = true;
        this.service.searchAuxs(q)
            .subscribe(
            res => this.searchEnd(res),
            err => this.searchEnd([])
            );
    }

    searchEnd(data: Aux[]) {
        this.auxs = data;
        this.loading = false;
    }

    keyUp(e: any, q: string) {
        if (e.keyCode === 13) {
            this.search(q);
        }
    }

    assignDialog(aux: Aux) {
        this.aux = aux;
        $('#assignModal').modal('open');
    }

    assign() {

        const auxs = this.selected.supervisor.auxiliares;
        let match = false;
        for (let a of auxs) {
            if (a.id === this.aux._id) {
                match = true;
                break;
            }
        }

        if (match) {
            Materialize.toast('El auxiliar ya se encuentra asignado', 4000);
        } else {
            this.auxA = { id: this.aux._id, nombre: this.aux.nombre, celular: this.aux.celular, imagen: this.aux.imagen };
            this.service.addAux(this.selected.supervisor._id, this.auxA).subscribe(
                res => this.assigned(res), err => this.assigned(false)
            );
        }
    }

    assigned(success: boolean) {
        if (!success) {
            Materialize.toast('Error al asignar auxiliar a supervisor', 4000);
        }
        this.selected.supervisor.auxiliares.push(this.auxA);
        Materialize.toast('Asignación exitosa', 4000);
    }
}
