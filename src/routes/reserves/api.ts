import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT } from '../../config/constants'
import { getList } from './services/_index'
import { genericGet } from '../_generic/_index';


export const RESERVES = 'reservas'

const api = Router()
const perm = new ResourcePermisions(RESERVES)
api.use(selectCollection(RESERVES))

perm.add('getList', [SUPER, STTM])
api.get('/', validateToken, validatePermission('getList'), getList)

perm.add('getReserve',[SUPER, STTM, AUX, SUPERVISOR])
api.get('/:id', validateToken, validatePermission('getReserve'), genericGet)

export default { api: api, permissions: perm } 