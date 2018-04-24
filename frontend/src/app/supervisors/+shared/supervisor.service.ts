import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { SessionService } from '../../+core/_index';
import { HttpClientService } from '../../+shared/_index';
import { Supervisor, AuxSupervisor } from './supervisor.model';
import { Aux } from '../../Auxs/+shared/_index';

@Injectable()
export class SupervisorService extends HttpClientService {

    private url = '/api/usuarios';
    private urlAux = '/api/auxiliares';
    private urlSupervisor = '/api/supervisores';

    constructor(http: Http, sesion: SessionService) {
        super(http, sesion);
    }

    public insertSupervisor(supervisor: Supervisor): Observable<[boolean, string, boolean]> {
        supervisor.auxiliares = [];
        supervisor.tipo = 'Supervisor';
        return this.post(this.url, supervisor, true).map(this.processAdd).catch(this.handleError);
    }

    private processAdd(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, body.id, false];
        } else {
            return [false, null, body.failImg];
        }
    }

    public getSupervisors(active: boolean): Observable<Supervisor[]> {
        return this.get(`${this.url}?q={"tipo":"Supervisor","activo":${active}}`, true).map(this.processList).catch(this.handleError);
    }

    public deleteSupervisor(id: string): Observable<boolean> {
        return this.delete(`${this.urlSupervisor}/${id}`, true).map(this.process).catch(this.handleError);
    }

    public addAux(id: string, aux: AuxSupervisor): Observable<boolean> {
        return this.post(`${this.urlSupervisor}/${id}/auxiliares`, aux, true).map(this.process).catch(this.handleError);
    }

    public getAuxs(id: string): Observable<AuxSupervisor[]> {
        return this.get(`${this.urlSupervisor}/${id}/auxiliares`, true).map(this.processList).catch(this.handleError);
    }

    public removeAux(id: string, idAux: string): Observable<boolean> {
        return this.delete(`${this.urlSupervisor}/${id}/auxiliares/${idAux}`, true).map(this.process).catch(this.handleError);
    }

    public updateSupervisor(id: string, name: string, doc: string, cel: string
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

    public resetPass(id: string, temporaryPass: string) {
        const body = { password: temporaryPass };
        return this.put(`${this.url}/${id}/reset`, body, true).map(this.process).catch(this.handleError);
    }

    public searchAuxs(q: string): Observable<Aux[]> {
        let queryText: string;
        let query;
        if (q) {
            query = {
                tipo: 'Auxiliar'
                , activo: true
                , $or: [
                    { nombre: { $regex: q, $options: 'i' } }
                    , { cedula: { $regex: q, $options: 'i' } }
                    , { celular: { $regex: q, $options: 'i' } }
                ]
            };
        } else {
            query = {
                tipo: 'Auxiliar'
                , activo: true
            };
        }
        queryText = `q=${JSON.stringify(query)}&`;
        return this.get(`${this.url}?${queryText}o={"nombre":1}&projection:{zonas:0}`, true).map(this.processList).catch(this.handleError);
    }

}
