import { Component, Input, OnInit } from '@angular/core';
import { ZoneService, Bay, Reserve } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-zone-bay',
    templateUrl: './zone-bay.component.html'
})
export class ZoneBayComponent implements OnInit {

    @Input() bay: Bay;
    @Input() id: string;
    @Input() index: number;

    dis: boolean;
    disIni: boolean;

    constructor(private service: ZoneService) { }

    ngOnInit() {
        this.disIni = this.bay.dis;
    }

    changeDis(checked: boolean) {
        this.dis = checked;
        this.service.updateDisability(this.id, this.index, checked)
            .subscribe(res => this.successChange(), err => Materialize.toast('Error al actualizar bahia', 4000));
    }

    successChange() {
        this.bay.dis = this.dis;
        Materialize.toast('Bahia actualizada', 4000);
    }


}
