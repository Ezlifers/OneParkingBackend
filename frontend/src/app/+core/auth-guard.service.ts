import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { SessionService } from './session.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private session: SessionService) {}

    canActivate() {
        if(!this.session.logged){
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }

}