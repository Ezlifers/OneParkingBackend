import { Component, Input, OnInit } from '@angular/core';
import { Zone, ZoneService } from '../../+shared/_index';
import { Aux, AuxService } from '../../../auxs/+shared/_index';

declare var Materialize: any;
declare var $: any;

@Component({
    selector: 'app-zone-auxs',
    templateUrl: './zone-auxs.component.html',
    providers: [AuxService]
})
export class ZoneAuxsComponent implements OnInit {

    @Input() zone: Zone;

    constructor(private service: ZoneService) { }

    ngOnInit() {
        $('.modal').modal();
        this.service.getAuxs(this.zone._id)
            .subscribe(res => this.service.auxs = res, err => Materialize.toast('Error al recuperar los auxiliares', 4000));
    }

    removeDialog() {
        $('#removeDialog').modal('open');
    }

    remove() {
        this.service.removeAllAux(this.zone._id)
            .subscribe(res => this.removed(res), err => this.removed(false));
    }

    removed(success: boolean) {

        if (!success) {
            Materialize.toast('Error al eliminar las asignaciones de auxiliares', 4000);
            return;
        }
        this.service.auxs = [];
        Materialize.toast('Asiganaciones de auxiliares removidas', 4000);

    }

    deletedAux(index: number) {
        this.service.auxs.splice(index, 1);
    }


}
