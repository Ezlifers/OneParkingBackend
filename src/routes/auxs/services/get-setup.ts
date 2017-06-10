import { IConfig } from '../../config/models/_index';
import { Aux } from '../../users/models/auxi';
import { ZONES } from '../../zones/api';
import { cacheConfig } from '../../../util/cache-util';
import { AuxZone } from '../../users/models/_index';
import { Zone } from '../../zones/models/_index';
import { ObjectID } from "mongodb";


class QuerySetup {
    onlyVersion: boolean;
    constructor(query: any) {
        this.onlyVersion = query.onlyVersion ? query.onlyVersion == 'true' : false;
    }
}

class Response{
    constructor(public success:boolean
    ,public version?:number
    , public config?:IConfig
    , public schdules?: AuxZone[]    
    , public zones?:Zone[]
    ){}
}

export function getSetup(req, res, next) {
    const id = req.idSelf;
    const query = new QuerySetup(req.query);

    req.collection.findOne({ _id: new ObjectID(req.idSelf) }).then(aux => {
        if (query.onlyVersion) {
            res.send(new Response(true, aux.version));
        } else {            
            cacheConfig(req, config=>{
                let zones = [];
                let ids: ObjectID[] = [];
                for (let z of aux.zonas) {
                    ids.push(new ObjectID(z.id));
                }
                req.db.collection(ZONES).find({ _id: { $in: ids } }, { tiempos: 1, defaultTiempos: 1 }).toArray().then((docs) => {
                    for (let z of docs) {
                        let zoneInfo = { _id: z._id, tiempos: z.tiempos };
                        if (z.defaultTiempos) {
                            zoneInfo.tiempos = config.tiempos;
                        }
                        zones.push(zoneInfo);
                    }
                    res.send(new Response(true, aux.version, config, aux.zonas, zones ));
                });
            });
        }
    });
    
}