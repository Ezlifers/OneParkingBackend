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
    
    let updated = {
        "configuracion.defaultTiempos": body.default,
        "configuracion.tiempos": body.tiempos
    }
    
    updateToSimpleRes(res, req.collection, { _id: id }, updated)
}
