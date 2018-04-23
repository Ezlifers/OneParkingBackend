import { Component, Input } from '@angular/core';
import { Zone, MapComponent } from '../../+shared/_index';

@Component({
    selector: 'app-zone-spec',
    templateUrl: './zone-spec.component.html'
})
export class ZoneSpecComponent {
    @Input() zone: Zone;
}
