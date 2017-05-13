import { getListToFailRes, Query } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { setUpZone } from '../util/zone-util'
import { defaultTimesActive } from '../util/state-util'
import { LOC_RADIUS } from '../../../config/constants'
import { Application } from "express";

class QueryStates extends Query { // No se usa ningun parametro de Query
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
            codigo: 0
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

        this.q.localizacion = { $geoWithin: { $centerSphere: [[this.lon, this.lat], LOC_RADIUS / 6378.1] } };
    }
}

export function getList(req, res, next) {
    /*let query =  new QueryZone(req.query)
    getListToFailRes(res, req.collection, query, (docs)=>{
        setUpZone(req.app, new Date(), query, docs).then(()=>{
            res.send(docs)
        })
    })*/
}