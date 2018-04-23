import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { SessionService, User } from '../../+core/_index';
import { HttpClientService } from '../../+shared/_index';

@Injectable()
export class ProfileService extends HttpClientService {

    private url = '/api/usuarios';

    constructor(http: Http, sesion: SessionService) {
        super(http, sesion);
    }

    public updateUser(id: string, name: string, doc: string, cel: string
        , img: string, imgName: string): Observable<[boolean, boolean, string]> {
        const body: any = { nombre: name, cedula: doc, celular: cel, imgMod: false };
        if (img) {
            body.imagen = img;
            body.imgMod = true;
            body.imgName = imgName;
        }
        return this.put(`${this.url}/${id}`, body, true).map(this.processUpdate).catch(this.handleError);
    }

    private processUpdate(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, false, body.imgUrl];
        } else {
            return [false, body.failImg, null];
        }
    }

    public updatePass(id: string, newPass: string) {
        const body = { password: newPass };
        return this.put(`${this.url}/${id}`, body, true).map(this.process).catch(this.handleError);
    }
}
