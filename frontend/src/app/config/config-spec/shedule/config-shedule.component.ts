import { Component, Input } from '@angular/core';
import { TimeRange } from '../../../zones/+shared/_index';

@Component({
    selector: 'app-config-shedule',
    templateUrl: './config-shedule.component.html'
})
export class ConfigSheduleComponent {
    @Input() times: TimeRange[];
    @Input() price: number;
}
