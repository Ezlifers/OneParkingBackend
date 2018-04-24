import { Component, Input } from '@angular/core';
import { Aux, AuxService, AuxSelectedService } from '../../+shared/_index';

@Component({
    selector: 'app-aux-spec',
    templateUrl: './aux-spec.component.html'
})
export class AuxSpecComponent {

    constructor(private service: AuxService, private selected: AuxSelectedService) { }

}
