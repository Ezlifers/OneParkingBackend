import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT } from '../../config/constants'
import { update, addZone, deleteAux, deleteZone, deleteSchedule, extendReserve, getLocation, getZones, insertLocation, notifyClient, reserve, stopReserve, recharge } from './services/_index'
import { USERS } from '../users/api'

export const AUXS = 'auxiliares'

const api = Router()
const perm = new ResourcePermisions(AUXS)
api.use(selectCollection(USERS, AUXS))

perm.add('recharge', [SUPER, STTM, AUX])
api.post('/recarga', validateToken, validatePermission('recharge'), recharge)

perm.add('addZone', [SUPER, STTM])
api.post('/:id/zonas', validateToken, validatePermission('addZone'), addZone)

perm.add('deleteZone', [SUPER, STTM])
api.put('/:id/zonas', validateToken, validatePermission('deleteZone'), deleteZone)

perm.add('update', [SUPER, STTM])
api.put('/:id', validateToken, validatePermission('update'), update)

perm.add('deleteSchedule', [SUPER, STTM])
api.put('/:id/horarios', validateToken, validatePermission('deleteSchedule'), deleteSchedule)

perm.add('delete', [SUPER, STTM])
api.delete('/:id', validateToken, validatePermission('delete'), deleteAux)

perm.add('getZones', [SUPER, STTM, SUPERVISOR, AUX])
api.get('/:id/zonas', validateToken, validatePermission('getZones'), getZones)

perm.add('reserve', [AUX])
api.post('/reservar', validateToken, validatePermission('reserve'), reserve)

perm.add('extendReserve', [AUX])
api.post('/extender/:id', validateToken, validatePermission('extendReserve'), extendReserve)

perm.add('stopReserve', [AUX])
api.post('/detener/:id', validateToken, validatePermission('stopReserve'), stopReserve)

perm.add('notifyClient', [AUX])
api.post('/client/:id', validateToken, validatePermission('notifyClient'), notifyClient)

perm.add('insertLocation', [AUX])
api.post('/localizacion', validateToken, validatePermission('insertLocation'), insertLocation)

perm.add('getLocation', [SUPER, STTM, SUPERVISOR])
api.get('/:id/localizacion', validateToken, validatePermission('getLocation'), getLocation)

export default { api: api, permissions: perm } 