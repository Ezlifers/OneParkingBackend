import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { URL_BASE } from '../../app.settings';
import { Observable } from 'rxjs/Observable';

import { Reserve } from './_index';

@Injectable()
export class IOZoneService {

    private url = `${URL_BASE}/socket/zones`;
    private socket;

    connect(id: string): Observable<IOZone> {
        const observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.emit('subscribe', { zone: id });
            this.socket.on('reserves', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.emit('unsubscribe', { zone: id });
                this.socket.disconnect();
            };
        })
        return observable;
    }


}

export interface IOZone {
    bay: string;
    reserve: Reserve;
}