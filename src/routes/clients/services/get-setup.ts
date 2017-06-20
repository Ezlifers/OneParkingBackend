import { cacheCash } from '../util/cache-cash';
import { IConfig } from '../../config/models/_index';
import { ZONES } from '../../zones/api';
import { cacheConfig, cacheVersion } from '../../../util/cache-util';
import { Zone } from '../../zones/models/_index';
import { ObjectID } from "mongodb";


class QuerySetup {
    onlyVersion: boolean;
    version: number;
    constructor(query: any) {
        this.onlyVersion = query.onlyVersion ? query.onlyVersion == 'true' : false;
        this.version = query.version ? parseInt(query.onlyVersion) : -1;
    }
}

class Response {
    constructor(public success: boolean
        , public version?: number
        , public config?:IConfig
        , public zones?: Zone[]
    ) { }
}

export function getSetup(req, res, next) {
    const query = new QuerySetup(req.query);
    cacheVersion(req, version => {
        if (query.onlyVersion) {
            res.send(new Response(true, version));
        } else {
            cacheConfig(req, config => {
                req.db.collection(ZONES).find({ version: { $gt: query.version } }, { bahias: 0, version: 0 }).toArray().then((docs) => {
                    for (let zone of docs) {
                        if (zone.defaultTiempos) {
                            zone.tiempos = config.tiempos;
                        }
                        delete zone.defaultTiempos;
                    }
                    res.send(new Response(true, version, config,  docs));
                }, (err) => {
                    res.send(new Response(false));
                });
            });
        }
    });
}