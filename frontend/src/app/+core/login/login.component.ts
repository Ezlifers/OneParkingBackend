import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { User, SessionService } from '../_index';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService]
})
export class LoginComponent {

    loginProcess = false;
    errorUnkown = false;
    errorInvalid = false;

    usuario: string;
    password: string;

    constructor(private router: Router, private service: LoginService, private session: SessionService) { }

    login() {
        this.loginProcess = true;
        this.service.login(this.usuario, this.password).subscribe(
            res => this.logged(res, false),
            error => this.logged([false, null, null, null], true));
    }

    logged(res: [boolean, User, any, string], error: boolean) {
        this.loginProcess = false;
        if (res[0]) {
            this.session.user = res[1];
            this.session.type = res[1].tipo;
            this.session.id = res[1]._id;
            this.session.permission = res[2];
            this.session.token = res[3];
            this.router.navigate(['dashboard']);

        } else {
            if (error) {
                this.errorUnkown = true;
            } else {
                this.errorInvalid = true;
            }
            setTimeout(() => this.resetError(), 2000);
        }
    }

    resetError() {
        this.errorUnkown = false;
        this.errorInvalid = false;
    }

}
