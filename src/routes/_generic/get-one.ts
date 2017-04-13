import { getOneToSimpleRes } from '../../util/response-util'
import { ObjectID } from 'mongodb'

export function genericGet(req, res, next) {
    let id = new ObjectID(req.params.id)
    getOneToSimpleRes(res, req.collection, {_id:id})
}