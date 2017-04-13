import { updateToSimpleRes } from '../../util/response-util'
import { ObjectID } from 'mongodb'

export function genericUpdate(req, res, next) {
    let body = req.body;
    let id = new ObjectID(req.params.id)
    updateToSimpleRes(res, req.collection, {_id:id}, body)
}