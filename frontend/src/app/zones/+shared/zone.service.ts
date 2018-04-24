import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClientService } from '../../+shared/_index';
import { SessionService } from '../../+core/_index';
import { Zone, ZoneBase, Bay, TimeRange } from './zone.model';
import { Aux } from '../../auxs/+shared/_index';

@Injectable()
export class ZoneService extends HttpClientService {

    private url = '/api/zonas';
    auxs: Aux[];

    constructor(http: Http, sesion: SessionService) {
        super(http, sesion);
    }

    public insertZone(zone: ZoneBase): Observable<[boolean, string, boolean]> {
        return this.post(this.url, zone, true).map(this.processInsert).catch(this.handleError);
    }

    private processInsert(res: Response) {
        const body = res.json();
        if (body.success) {
            return [true, body.id, false];
        } else {
            return [false, null, body.outRange];
        }
    }

    public getZones(): Observable<Zone[]> {
        return this.get(`${this.url}?times=none&state=true&disability=true`, true)
            .map(this.processList).catch(this.handleError);
    }

    public getBays(id: string): Observable<Bay[]> {
        return this.get(`${this.url}/${id}/bahias`, true).map(this.processList).catch(this.handleError);
    }

    public getZone(id: string): Observable<Zone> {
        return this.get(`${this.url}/${id}?times=all&bays=true`, true).map(this.processObj).catch(this.handleError);
    }

    public getAuxs(id: string): Observable<Aux[]> {
        return this.get(`${this.url}/${id}/auxiliares`, true).map(this.processList).catch(this.handleError);
    }

    public update(id: string, nombre: string, codigo: number, direccion: string, lat: number, lon: number): Observable<boolean> {
        const body = { nombre: nombre, codigo: codigo, direccion: direccion, localizacion: { coordinates: [lon, lat] } };
        return this.put(`${this.url}/${id}`, body, true).map(this.process).catch(this.handleError);
    }

    public updateBays(id: string, n: number): Observable<boolean> {
        return this.put(`${this.url}/${id}/bahias`, { cantidad: n }, true).map(this.process).catch(this.handleError);
    }

    public updateDisability(id: string, pos: number, dis: boolean): Observable<boolean> {
        const body = { pos: pos, dis: dis };
        return this.put(`${this.url}/${id}/bahias/discapacidad`, body, true).map(this.process).catch(this.handleError);
    }

    public updateTimeShedule(id: string, defaults: boolean, times: TimeRange[]) {
        const body = { default: defaults, tiempos: times };
        return this.put(`${this.url}/${id}/horario`, body, true).map(this.process).catch(this.handleError);
    }

    public deleteZone(id: string): Observable<boolean> {
        return this.delete(`${this.url}/${id}`, true).map(this.process).catch(this.handleError);
    }

    public removeAllAux(id: string): Observable<boolean> {
        return this.delete(`${this.url}/${id}/auxiliares`, true).map(this.process).catch(this.handleError);
    }

}
