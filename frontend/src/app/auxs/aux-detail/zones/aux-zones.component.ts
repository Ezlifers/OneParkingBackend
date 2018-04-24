import { Component } from '@angular/core';
import { ZoneAux, AuxSelectedService, AuxService } from '../../+shared/_index';

declare var $: any;
declare var Materialize: any;

@Component({
    selector: 'app-aux-zones',
    templateUrl: './aux-zones.component.html'
})
export class AuxZonesComponent {

    constructor(public selected: AuxSelectedService) { }

    assingZone() {
        $('ul.tabs').tabs('select_tab', 'assign');
    }




}
