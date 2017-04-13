import { pushToSimpleRes } from '../../util/response-util'
import { ObjectID } from 'mongodb'

export function genericPush(req, res, next) {
    let body = req.body;
    let id = new ObjectID(req.params.id)
    pushToSimpleRes(res, req.collection,id, body)
}