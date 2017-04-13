import { updateToSimpleRes } from '../../../util/response-util'
import {ObjectID} from 'mongodb'

export function attend(req, res, next){
    let id = new ObjectID(req.params.id)
    updateToSimpleRes(res, req.collection, {_id:id}, { atendida: true, fechaAtencion: new Date() })
}