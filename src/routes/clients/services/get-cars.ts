import { ObjectID } from 'mongodb'
import { getOneToRes } from '../../../util/_index'

export function getCars(req, res, next){

    let id =  new ObjectID(req.params.id)
    getOneToRes(res, req.collection, {_id:id}, {vehiculos:1},(doc)=>{
        return doc.vehiculos
    },()=>{
        return []
    })

}
