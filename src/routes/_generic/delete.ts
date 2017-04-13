import { deleteToSimpleRes } from '../../util/response-util'
import { ObjectID } from 'mongodb'

export function genericDelete(req, res, next) {
    let id = new ObjectID(req.params.id)
    deleteToSimpleRes(res, req.collection, id)
}