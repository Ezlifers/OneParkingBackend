import { Component, Input } from '@angular/core';
import { Config } from '../+shared/_index';

@Component({
    selector: 'app-config-spec',
    templateUrl: './config-spec.component.html'
})
export class ConfigSpecComponent {
    @Input() config: Config;
}
