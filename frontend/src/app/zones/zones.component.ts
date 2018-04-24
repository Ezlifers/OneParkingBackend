import { Component } from '@angular/core';
import { NavigationService } from '../+core/_index';

@Component({
    template: '<router-outlet></router-outlet>'
})
export class ZonesComponent {

    constructor(public nav: NavigationService) {
        nav.title = 'Zonas';
    }

}
