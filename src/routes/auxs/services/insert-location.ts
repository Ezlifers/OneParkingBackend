import { ObjectID } from 'mongodb'
import { insertToSimpleRes } from '../../../util/_index'

interface RequestBody{
    aux?:ObjectID
    fecha?:Date
    lat:number
    lon:number
}

export function insertLocation(req, res, next){

    let locationCollection = req.db.collection("auxiliares_loc")
    let body:RequestBody = req.body

    body.aux = req.idSelf
    body.fecha = new Date()

    insertToSimpleRes(res, locationCollection, body)

}