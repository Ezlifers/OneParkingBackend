import { USERS } from '../../users/api'
import { AUX } from '../../../config/constants'
import { updateManyToSimpleRes } from '../../../util/_index'

export function resetAuxs(req, res, next){
    let userCollection = req.db.collection(USERS)
    updateManyToSimpleRes(res, userCollection, {tipo:AUX, activo:true},{zonas:[]})
}