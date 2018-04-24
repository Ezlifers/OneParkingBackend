import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { SessionService } from '../../+core/_index';
import { HttpClientService } from '../../+shared/_index';
import { ZoneAux, Aux, ScheduleAux } from './auxs.model';
import { Zone } from '../../zones/+shared/_index';

@Injectable()
export class AuxService extends HttpClientService {

    private urlUsers = '/api/usuarios';
    private urlZones = '/api/zonas';
    private urlAux = '/api/auxiliares';

    constructor(http: Http, sesion: SessionService) {
        super(http, sesion);
    }

    public insertAux(aux: Aux): Observable<[boolean, string, boolean]> {
        aux.zonas = [];
        aux.tipo = 'Auxiliar';
        aux.version = 0;
        return this.post(this.urlUsers, aux, true).map(this.processAdd).catch(this.handleError);
    }

    private processAdd(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, body.id, false];
        } else {
            return [false, null, body.failImg];
        }
    }

    public getAuxs(active: boolean): Observable<Aux[]> {
        return this.get(`${this.urlUsers}?q={"tipo":"Auxiliar","activo":${active}}`, true).map(this.processList).catch(this.handleError);
    }

    public updateAux(id: string, name: string, cc: string, cel: string, dev: string
        , img: string, imgName: string): Observable<[boolean, boolean, string]> {
        const body: any = { nombre: name, cedula: cc, celular: cel, dispositivo: dev, imgMod: false };
        if (img) {
            body.imagen = img;
            body.imgMod = true;
            body.imgName = imgName;
        }
        return this.put(`${this.urlAux}/${id}`, body, true).map(this.processEdit).catch(this.handleError);
    }

    public deleteAux(id: string): Observable<boolean> {
        return this.delete(`${this.urlAux}/${id}`,true).map(this.process).catch(this.handleError);
    }


    private processEdit(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, false, body.imgUrl];
        } else {
            return [false, body.failImg, null];
        }
    }

    public addZone(id: string, zone: ZoneAux): Observable<boolean> {
        return this.post(`${this.urlAux}/${id}/zonas`, zone, true).map(this.process).catch(this.handleError);
    }

    public getZones(id: string): Observable<ZoneAux[]> {
        return this.get(`${this.urlAux}/${id}/zonas`, true).map(this.processList).catch(this.handleError);
    }

    public removeSchedule(id: string, idZone: string, schedule: ScheduleAux): Observable<boolean> {
        const body = { dias: schedule.dias, id: idZone, ti: schedule.ti, tf: schedule.tf };
        return this.put(`${this.urlAux}/${id}/horarios`, body, true).map(this.process).catch(this.handleError);
    }

    public removeZone(id: string, idZone: string): Observable<boolean> {
        const body = { id: idZone };
        return this.put(`${this.urlAux}/${id}/zonas`, body, true).map(this.process).catch(this.handleError);
    }

    public resetPass(id: string, temporaryPass: string) {
        const body = { password: temporaryPass };
        return this.put(`${this.urlUsers}/${id}/reset`, body, true).map(this.process).catch(this.handleError);
    }

    public searchZones(q: string): Observable<Zone[]> {
        let queryText: string;
        if (q) {
            let query;
            const n = parseInt(q, 10);
            if (n) {
                query = { codigo: n };
            } else {
                query = { nombre: { $regex: `${q}`, $options: 'i' } };
            }
            queryText = `q=${JSON.stringify(query)}&`;
        }
        return this.get(`${this.urlZones}?${queryText}o={"nombre":1}&times=all&state=false&disability=false`, true)
            .map(this.processList).catch(this.handleError);
    }

    // public getLoc(id: string, from: number): Observable<Loc[]> {
    //     const to = from + 86400000;
    //     return this.get(this.urlAux + "/" + id + "/localizacion?from=" + from + "&to=" + to, true)
    // .map(this.processList).catch(this.handleError);
    // }

}
