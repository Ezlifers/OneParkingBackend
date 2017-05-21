import { ObjectID } from 'mongodb'
import { getOneToFailRes,updateToSimpleRes, ResponseSimple } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { ZONE_VERSION } from '../../../config/constants';

interface RequestBody {
    //TODO: la cantidad actual, no la diferencia
    cantidad: number
}

export function updateBays(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body
    const version = req.app.get(ZONE_VERSION) + 1;
   
    getOneToFailRes(res, req.collection, { _id: id }, null, (doc) => {
        let zone: Zone = doc
        let bays = zone.bahias
        let sub = bays.length - body.cantidad

        if (sub == 0) {
            res.send(new ResponseSimple(false))
        } else if (sub < 0) {
            sub *= -1
            let size = bays.length;
            for (let i = 0; i < sub; i++)
                bays.push({ index: i + size, dis: false, reserva: null })
        } else {
            bays.splice(body.cantidad, sub)
        }
        req.app.set(ZONE_VERSION, version)
        updateToSimpleRes(res, req.collection, {_id:id}, {version:version, bahias: bays})
    })

}