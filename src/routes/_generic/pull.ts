import { pullToSimpleRes } from '../../util/response-util'
import { ObjectID } from 'mongodb'

export function genericPull(req, res, next) {
    let body = req.body;
    let id = new ObjectID(req.params.id)
    pullToSimpleRes(res, req.collection,id, body)
}