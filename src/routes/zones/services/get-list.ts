import { getListToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { setUpZone, QueryZone } from '../util/zone-util'
import { ZONE_VERSION } from '../../../config/constants';


export function getList(req, res, next) {
    let query = new QueryZone(req.query)
    getListToFailRes(res, req.collection, query, (docs) => {
        setUpZone(req.app, new Date(), query, docs).then(() => {
            if (query.version > -1) {
                res.send({ version: req.app.get(ZONE_VERSION), zones: docs })
            } else {
                res.send(docs)
            }

        })
    })
}