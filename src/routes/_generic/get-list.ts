import { getListToSimpleRes, Query } from '../../util/response-util'

export function genericGetList(req, res, next) {
    let query = new Query(req.query)
    getListToSimpleRes(res, req.collection, query)
}