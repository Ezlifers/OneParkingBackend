import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/response-util'
import { TimeRange } from '../models/_index'
import { ZONE_VERSION } from '../../../config/constants';

interface RequestBody {
    default: boolean
    tiempos: TimeRange[]
}

export function updateShedule(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body
    const version = req.app.get(ZONE_VERSION) + 1;
    req.app.set(ZONE_VERSION, version)
        
    updateToSimpleRes(res, req.collection, { _id: id }, {tiempos: body.tiempos, defaultTiempos: body.default, version: version})
}
