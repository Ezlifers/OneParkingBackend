import { Component } from '@angular/core';
import { AuxSupervisor, SupervisorService, SupervisorSelectedService } from '../../+shared/_index';

declare var $: any;
declare var Materialize: any;

@Component({
    selector: 'app-supervisor-auxs',
    templateUrl: './supervisor-auxs.component.html'
})
export class SupervisorAuxsComponent {

    index: number;

    constructor(private selected: SupervisorSelectedService, private service: SupervisorService) { }

    assingAux() {
        $('ul.tabs').tabs('select_tab', 'assign');
    }

    remove(id: string, index: number) {
        this.index = index;
        this.service.removeAux(this.selected.supervisor._id, id)
            .subscribe(res => this.removed(res), err => this.removed(false));
    }

    removed(success: boolean) {
        if (success) {
            this.selected.supervisor.auxiliares.splice(this.index, 1);
            Materialize.toast('Auxiliar asignado removido', 4000);
        } else {
            Materialize.toast('Error al remover auxiliar', 4000);
        }
    }

}
