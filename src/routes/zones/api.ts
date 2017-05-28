import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT } from '../../config/constants'
import { deleteZone, deleteAuxs, getAuxs, getBays, getList, getState, getStates,getZone, insert, updateZone, updateBayDisability, updateBays, updateShedule, updateTimes } from './services/_index'

export const ZONES = 'zonas'

const api = Router()
const perm = new ResourcePermisions(ZONES)
api.use(selectCollection(ZONES))

perm.add('insert', [SUPER, STTM])
api.post('/', validateToken, validatePermission('insert'), insert)

perm.add('getList', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/', validateToken, validatePermission('getList'), getList)

perm.add('getStates', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/estados', validateToken, validatePermission('getStates'), getStates)

perm.add('getZone', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/:id', validateToken, validatePermission('getZone'), getZone)

perm.add('getBays', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/:id/bahias', validateToken, validatePermission('getBays'), getBays)

perm.add('getState', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/:id/estado', validateToken, validatePermission('getState'), getState)

perm.add('getAuxs', [SUPER, STTM, SUPERVISOR])
api.get('/:id/auxiliares', validateToken, validatePermission('getAuxs'), getAuxs)

perm.add('update', [SUPER, STTM])
api.put('/:id', validateToken, validatePermission('update'), updateZone)

perm.add('updateBayDisability', [SUPER, STTM])
api.put('/:id/bahias/discapacidad', validateToken, validatePermission('updateBayDisability'), updateBayDisability)

perm.add('updateBays', [SUPER, STTM])
api.put('/:id/bahias', validateToken, validatePermission('updateBays'), updateBays)

perm.add('updateTimes', [SUPER, STTM])
api.put('/:id/tiempos', validateToken, validatePermission('updateTimes'), updateTimes)

//TODO:cambiar tiempouso por horario
perm.add('updateShedule', [SUPER, STTM])
api.put('/:id/horario', validateToken, validatePermission('updateShedule'), updateShedule)

//TODO: analizar si se unifica delete auxs con delete de zonas
perm.add('delete', [SUPER, STTM])
api.delete('/:id', validateToken, validatePermission('delete'), deleteZone)

perm.add('deleteAuxs', [SUPER, STTM])
api.delete('/:id/auxiliares', validateToken, validatePermission('deleteAuxs'), deleteAuxs)

export default { api: api, permissions: perm } 