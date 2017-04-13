import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/_index'

interface RequestBody{
    saldo:number
}

export function updateCash(req, res, next){

    let id = new ObjectID(req.params.id)
    let body:RequestBody =  req.body
    updateToSimpleRes(res, req.collection, {_id:id}, {saldo : body.saldo})

}