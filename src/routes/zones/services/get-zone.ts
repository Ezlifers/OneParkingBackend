import { ObjectID } from 'mongodb'
import { getOneToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { setUpZone, QueryZone } from '../util/zone-util'

export function getZone(req, res, next) {
    let id = new ObjectID(req.params.id)
    let query = new QueryZone(req.query)
    getOneToFailRes(res, req.collection, { _id: id }, query.projection, (doc) => {
        let zones: Zone[] = [doc]
        setUpZone(req, new Date, query, zones).then(() => {
            res.send(zones[0])
        })
    })
}