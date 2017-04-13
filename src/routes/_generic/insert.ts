import { insertToSimpleRes } from '../../util/response-util'

export function genericInsert(req, res, next) {
    let body = req.body;
    insertToSimpleRes(res, req.collection, body)
}