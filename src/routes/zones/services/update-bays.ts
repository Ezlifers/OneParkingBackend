import { ObjectID } from 'mongodb'
import { getOneToFailRes,updateToSimpleRes, ResponseSimple } from '../../../util/response-util'
import { Zone } from '../models/_index'

interface RequestBody {
    //TODO: la cantidad actual, no la diferencia
    cantidad: number
}

export function updateBays(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body

    getOneToFailRes(res, req.collection, { _id: id }, null, (doc) => {
        let zone: Zone = doc
        let bays = zone.bahias
        let sub = bays.length - body.cantidad

        if (sub == 0) {
            res.send(new ResponseSimple(false))
        } else if (sub < 0) {
            sub *= -1
            for (let i = 0; i < sub; i++)
                bays.push({ index: i + bays.length, dis: false, reserva: null })
        } else {
            bays.splice(body.cantidad-1, sub)
        }
        updateToSimpleRes(res, req.collection, {_id:id}, {bahias: bays})
    })

}