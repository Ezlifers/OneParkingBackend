import { DATA_VERSION } from '../../../config/constants';
import { cacheVersion } from '../../../util/cache-util';
import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/response-util'
import { TimeRange } from '../models/_index'

interface RequestBody {
    default: boolean
    tiempos: TimeRange[]
}

export function updateShedule(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body
    cacheVersion(req, version=>{
        const newVersion = version + 1;
        updateToSimpleRes(res, req.collection, { _id: id }, {tiempos: body.tiempos, defaultTiempos: body.default, version: newVersion},()=>{
            req.redis.set(DATA_VERSION, "" + newVersion);
        });
    })
        
    
}
