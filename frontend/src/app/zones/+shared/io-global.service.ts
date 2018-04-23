import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { URL_BASE } from '../../app.settings';
import { Observable } from 'rxjs/Observable';

export const RESERVE = 0;
export const END_RESERVE = 1;

@Injectable()
export class IOGlobalService {

    private url = `${URL_BASE}/socket/global`;
    private socket;

    connect(): Observable<IOGlobal> {
        const observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.emit('subscribe');
            this.socket.on('global_state', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.emit('unsubscribe');
                this.socket.disconnect();
            };
        })
        return observable;
    }


}

export interface IOGlobal {
    id: string;
    type: number;
    dis: boolean;
}