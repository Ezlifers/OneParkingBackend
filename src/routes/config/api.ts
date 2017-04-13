import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT} from '../../config/constants'
import { get, update, resetAuxs } from './services/_index'

export const CONFIG = "configuracion"

const config = Router()
const perm = new ResourcePermisions(CONFIG)
config.use(selectCollection(CONFIG))

//Obtener
perm.add("get", [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
config.get('/', validateToken, validatePermission("get"), get)

//Actualziar
perm.add("update", [SUPER, STTM])
config.put('/', validateToken, validatePermission("update"), update)

//Reset Auxs
perm.add('resetAuxs', [SUPER, STTM])
config.delete('/auxiliares', validateToken, validatePermission('resetAuxs'), resetAuxs)

export default {api:config, permissions: perm} 
