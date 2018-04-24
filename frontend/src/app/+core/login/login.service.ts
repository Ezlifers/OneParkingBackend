import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { SessionService, User } from '../_index';
import { HttpClientService } from '../../+shared/_index';
import { SECRET, ROLES } from '../../app.settings';

@Injectable()
export class LoginService extends HttpClientService {

    private url = '/api/usuarios/login';

    constructor(http: Http, session: SessionService) {
        super(http, session);
    }

    public login(usr: string, pass: string): Observable<[boolean, User, any, string]> {
        const body = { user: usr, password: pass, roles: ROLES, timestamp: Date.now() };
        return this.post(this.url, body, false)
            .map(this.processLogin)
            .catch(this.handleError);
    }

    private processLogin(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, body.user, body.permissions, body.token];
        } else {
            return [false, null, null];
        }
    }

}
