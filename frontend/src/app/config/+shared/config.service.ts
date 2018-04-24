import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClientService } from '../../+shared/_index';
import { SessionService } from '../../+core/_index';
import { Config } from './config.model';

@Injectable()
export class ConfigService extends HttpClientService {

    private url = '/api/configuracion';

    constructor(http: Http, sesion: SessionService) {
        super(http, sesion);
    }

    public getConfig(): Observable<Config> {
        return this.get(this.url, true).map(this.processObj).catch(this.handleError);
    }

    public editConfig(config: Config) {
        config.tiempoMax = config.tiempoMax * 60;
        config.tiempoMin = config.tiempoMin * 60;
        return this.put(this.url, config, true).map(this.processObj).catch(this.handleError);
    }

    public resetAuxs() {
        return this.delete(`${this.url}/auxiliares`, true).map(this.process).catch(this.handleError);
    }


}
