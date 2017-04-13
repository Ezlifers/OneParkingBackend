import { getOneToSimpleRes } from '../../../util/response-util'
import { ObjectID } from 'mongodb'

export const GET_SELF = "getSelf"

export function getSelf(req, res, next) {
    getOneToSimpleRes(res, req.collection, {_id: req.idSelf})
}