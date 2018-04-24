import { Component, Input } from '@angular/core';
import { Supervisor, SupervisorService, SupervisorSelectedService } from '../../+shared/_index';

@Component({
    selector: 'app-supervisor-spec',
    templateUrl: './supervisor-spec.component.html'
})
export class SupervisorSpecComponent {

    constructor(private service: SupervisorService, private selected: SupervisorSelectedService) { }

}
