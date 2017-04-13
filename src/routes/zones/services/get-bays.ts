import { ObjectID } from 'mongodb'
import { getOneToRes } from '../../../util/response-util'

export function getBays(req, res, next) {
    let id = new ObjectID(req.params.id)
    getOneToRes(res, req.collection, {_id:id}, {}, (doc)=>{
        return doc.bahias
    }, ()=>{
        return []
    } )
}