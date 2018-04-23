import { Component, Input } from '@angular/core';
import { Bay } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-zone-bays',
    templateUrl: './zone-bays.component.html'
})
export class ZoneBaysComponent {

    @Input() bays: Bay[];
    @Input() id: string;

}
