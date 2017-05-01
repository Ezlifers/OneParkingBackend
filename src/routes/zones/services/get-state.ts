import { ObjectID } from 'mongodb'
import { getOneToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { makeState } from '../util/zone-util'

export function getState(req, res, next) {
    let dis = req.query.disability ? req.query.disability == "true" : false
    let id = new ObjectID(req.params.id)

    getOneToFailRes(res, req.collection, { _id: id }, null, (doc) => {
        let zone: Zone = doc
        let state = makeState(zone, new Date(), dis, req.app)
        res.send(state)
    })

}