import { Component, Input } from '@angular/core';
import { Aux, AuxService, AuxSelectedService } from '../../+shared/_index';

@Component({
    selector: 'app-aux-spec',
    templateUrl: './aux-spec.component.html'
})
export class AuxSpecComponent {

    constructor(public service: AuxService, public selected: AuxSelectedService) { }

}
