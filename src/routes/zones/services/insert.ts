import { DATA_VERSION } from '../../../config/constants';
import { cacheVersion } from '../../../util/cache-util';
import { CONFIG } from '../../../config/main';
import { insertToRes } from '../../../util/response-util';
import { Zone, ZoneBase } from '../models/_index';

class RequestBody extends ZoneBase {
    nBahias: number;
}

class Response {
    constructor(private success: boolean
        , private id: string
        , private outRange: boolean
    ) { }
}

export function insert(req, res, next) {
    let zoneRequest: RequestBody = req.body;
    let zone = new Zone(zoneRequest);

    cacheVersion(req, version => {
        
        let lat1 = CONFIG.limits.p1.lat;
        let lon1 = CONFIG.limits.p1.lon;
        let lat2 = CONFIG.limits.p2.lat;
        let lon2 = CONFIG.limits.p2.lon;

        let latZone = zoneRequest.localizacion.coordinates[1];
        let lonZone = zoneRequest.localizacion.coordinates[0];


        if (latZone < lat1 && latZone > lat2 && lonZone < lon2 && lonZone > lon1) {

            zone.defaultTiempos = true;
            zone.tiempos = [];
            zone.bahias = [];

            for (let i = 0; i < zoneRequest.nBahias; i++) {
                zone.bahias.push({ index: i, dis: false, reserva: null })
            }
            zone.version = version + 1;
            insertToRes(res, req.collection, zone, (id) => {
                req.redis.set(DATA_VERSION, "" + zone.version);
                return new Response(true, `${id}`, false)
            }, () => {
                return new Response(false, null, false)
            })
        } else {
            res.send(new Response(false, null, true))
        }
    });
}