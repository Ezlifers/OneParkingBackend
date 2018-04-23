import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Incident } from './incident.model';
import { Http, Response } from '@angular/http';
import { SessionService } from '../../+core/_index';
import { HttpClientService } from '../../+shared/_index';

@Injectable()
export class IncidentService extends HttpClientService {

    private url = '/api/incidencias';

    constructor(http: Http, session: SessionService) {
        super(http, session);
    }

    getIncidents(fromDate: string, toDate: string, all: boolean) {

        let q = '?';
        const sort = 'sort={"fecha":-1}';

        if (fromDate && fromDate !== '') {
            q += `${q}from=${fromDate}&`;
        }
        if (toDate && toDate !== '') {
            q += `to=${toDate}&`;
        }
        if (all) {
            q += 'all=true&';
        }
        return this.get(`${this.url}${q}${sort}`, true).map(this.processList).catch(this.handleError);
    }

    attendIncident(id: string) {
        return this.put(`${this.url}/${id}`, null, true).map(this.process).catch(this.handleError);
    }

}