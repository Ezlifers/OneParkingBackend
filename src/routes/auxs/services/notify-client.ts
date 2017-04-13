import { ObjectID } from 'mongodb'
import { Notification } from '../models/_index'
import { insertToSimpleRes } from '../../../util/_index'
import { AUX } from '../../../config/constants'

export function notifyClient(req, res, next){

    let notificationCollection =  req.db.collection("notificaciones")
    let notification:Notification = req.body
    notification.fecha = new Date()
    notification.usuario = { id: req.idSelf, tipo:AUX}
    
    insertToSimpleRes(res, notificationCollection, notification)

}