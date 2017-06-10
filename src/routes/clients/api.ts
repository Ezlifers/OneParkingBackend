import { USERS } from '../users/api';
import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT } from '../../config/constants'
import { getSetup, addCar, addCash, deleteCar, extendReserve, getCars, getCash, reserve, stopReserve, updateCash } from './services/_index'

export const CLIENTS = 'clientes'

const api = Router()
const perm = new ResourcePermisions(CLIENTS)
api.use(selectCollection(USERS, CLIENTS))

perm.add('getSetup', [AUX])
api.get('/configuracion', validateToken, validatePermission('getSetup'), getSetup)

perm.add('addCar', [CLIENT])
api.post('/vehiculos', validateToken, validatePermission('addCar'), addCar)

perm.add('deleteCar', [CLIENT])
api.delete('/vehiculos/:placa', validateToken, validatePermission('deleteCar'), deleteCar)

perm.add('reserve', [CLIENT])
api.post('/reservar', validateToken, validatePermission('reserve'), reserve)

perm.add('extendReserve', [CLIENT])
api.post('/extender/:id', validateToken, validatePermission('extendReserve'), extendReserve)

perm.add('stopReserve', [CLIENT])
api.post('/detener/:id', validateToken, validatePermission('stopReserve'), stopReserve)

perm.add('getCash', [SUPER, STTM, CLIENT])
api.get('/:id/saldo', validateToken, validatePermission('getCash'), getCash)

perm.add('addCash', [SUPER, STTM])
api.post('/:id/saldo', validateToken, validatePermission('addCash'), addCash)

perm.add('updateCash', [SUPER, STTM])
api.put('/:id/saldo', validateToken, validatePermission('updateCash'), updateCash)

perm.add('getCars', [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
api.get('/:id/vehiculos', validateToken, validatePermission('getCars'), getCars)





export default { api: api, permissions: perm } 