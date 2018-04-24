import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavAsideService } from './nav-aside.service';
import { SessionService, User } from '../../_index';
import { URL_BASE } from '../../../app.settings';

@Component({
    selector: 'app-nav',
    templateUrl: './nav-aside.component.html',
    styleUrls: ['./nav-aside.component.css'],
    providers: [NavAsideService]
})
export class NavAsideComponent {

    url: string;
    user: User;

    constructor(private router: Router, private session: SessionService, private nav: NavAsideService) {
        this.url = URL_BASE;
        this.user = session.user;
    }

    logout() {
        this.router.navigate(['../']);
    }

}
