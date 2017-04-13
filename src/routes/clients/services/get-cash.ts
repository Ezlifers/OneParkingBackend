import { getOneToFailRes } from '../../../util/_index'
import { ObjectID } from 'mongodb'

class Response {
    constructor(private saldo: number) { }
}

export function getCash(req, res, next) {

    let id = new ObjectID(req.params.id)
    getOneToFailRes(res, req.collection, { _id: id }, { saldo: 1 }, (doc) => {
        res.send(new Response(doc.saldo))
    })

}