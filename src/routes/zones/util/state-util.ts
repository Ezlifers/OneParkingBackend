import { Application } from 'express';
import { DEFAULT_TIMES, LOC_RADIUS } from '../../../config/constants';
import { TimeRange } from '../models/_index';

import { Query } from '../../../util/response-util';
import { Zone, State } from '../models/_index'
import { setUpState } from './zone-util';

export class QueryStates extends Query { // No se usa ningun parametro de Query
    lat: number;
    lon: number;
    prevLat: number;
    prevLon: number;
    prev: boolean;

    day: number; // 0 L-V, 1 S, 2 D (Obligatorio)
    timeHour: number; // hours in day (Obligatorio)

    constructor(query: any, app: Application) {
        super(query);
        this.lat = query.lat ? parseFloat(query.lat) : null;
        this.lon = query.lon ? parseFloat(query.lon) : null;
        this.prevLat = query.prevLat ? parseFloat(query.prevLat) : null;
        this.prevLon = query.prevLon ? parseFloat(query.prevLon) : null;
        this.prev = this.prevLat != null && this.prevLon != null;

        this.day = query.day ? parseInt(query.day) : null;
        this.timeHour = query.timeHour ? parseInt(query.timeHour) : null;

        this.projection = {
            nombre: 0,
            direccion: 0,
            codigo: 0,
            localizacion: 0
        };

        if (defaultTimesActive(this.day, this.timeHour, app)) {
            this.q = {
                $or: [
                    { "configuracion.defaultTiempos": true }
                    , { [`configuracion.tiempos.${this.day}.horarios`]: { $elemMatch: { ti: { $lte: this.timeHour }, tf: { $gt: this.timeHour }, d: true } } }
                ]
            };
        } else {
            this.q = { "configuracion.defaultTiempos": false, [`configuracion.tiempos.${this.day}.horarios`]: { $elemMatch: { ti: { $lte: this.timeHour }, tf: { $gt: this.timeHour }, d: true } } };
        }

        if (this.prev) {
            this.q.$and = [{ localizacion: { $geoWithin: { $centerSphere: [[this.lon, this.lat], LOC_RADIUS / 6378.1] } } }, { localizacion: { $not: { $geoWithin: { $centerSphere: [[this.prevLon, this.prevLat], LOC_RADIUS / 6378.1] } } } }];
        } else {
            this.q.localizacion = { $geoWithin: { $centerSphere: [[this.lon, this.lat], LOC_RADIUS / 6378.1] } };
        }
    }
}

export function defaultTimesActive(day: number, hour: number, app: Application): boolean {
    let active = false;
    let times: TimeRange[] = app.get(DEFAULT_TIMES);
    for (let h of times[day].horarios) {
        if (hour >= h.ti && hour < h.ti && h.d) {
            active = true;
            break;
        }
    }
    return active;
}

export function setUpStates(app: Application, current: Date, query: QueryStates, zones: Zone[]): Promise<any> {
    let promise = new Promise((resolve) => {
        for (let zone of zones) {
            setUpState(zone, current, true, false, app);
            delete zone.configuracion;           
        }
        resolve()
    })
    return promise;
}