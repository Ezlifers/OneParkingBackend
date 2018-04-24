import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { SessionService } from '../../+core/_index';
import { URL_BASE } from '../../app.settings';

export abstract class HttpClientService {

    urlBase: string;

    constructor(protected http: Http, protected session: SessionService) {
        this.urlBase = URL_BASE;
    }

    protected get(url: string, auth: boolean): Observable<Response> {
        const data: [string, string, RequestOptions] = this.makeRequestData(url, null, auth);
        return this.http.get(data[0], data[2]);
    }

    protected post(url: string, body: any, auth: boolean): Observable<Response> {
        const data: [string, string, RequestOptions] = this.makeRequestData(url, body, auth);
        return this.http.post(data[0], data[1], data[2]);
    }

    protected put(url: string, body: any, auth: boolean): Observable<Response> {
        const data: [string, string, RequestOptions] = this.makeRequestData(url, body, auth);
        return this.http.put(data[0], data[1], data[2]);
    }

    protected delete(url: string, auth: boolean): Observable<Response> {
        const data: [string, string, RequestOptions] = this.makeRequestData(url, null, auth);
        return this.http.delete(data[0], data[2]);
    }

    private makeToken(): string {
        return this.session.token + '_&&_' + Date.now();
    }

    private makeRequestData(url: string, body: any, auth: boolean): [string, string, RequestOptions] {
        const u = this.urlBase + url;

        let bodyJson: string = null;
        if (body) {
            bodyJson = JSON.stringify(body);
        }
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        if (auth) {
            options.headers.append('Authorization', this.makeToken());
        }
        return [u, bodyJson, options];
    }

    protected processList(res: Response) {
        const body = res.json();
        if (body) {
            return body;
        } else {
            return [];
        }
    }

    protected processObj(res: Response) {
        const body = res.json();
        if (body) {
            return body;
        } else {
            return {};
        }
    }

    protected process(res: Response) {
        const body = res.json();
        if (body && body.success) {
            return true;
        } else {
            return false;
        }
    }

    protected handleError(error: any) {
        return Observable.throw(true);
    }

}

