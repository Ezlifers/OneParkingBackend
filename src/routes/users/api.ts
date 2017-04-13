import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT } from '../../config/constants'
import { getSelf, insert, login, register, resetPass, update, updatePass } from './services/_index'
import { genericDelete, genericGetList } from '../_generic/_index'

export const USERS = "usuarios"

const users = Router()
const perm = new ResourcePermisions(USERS)
users.use(selectCollection(USERS))

//Registro
users.post('/signin', register)

//login
users.post('/login', login) 

//Insertar
perm.add("insert", [SUPER, STTM])
users.post('/', validateToken, validatePermission("insert"), insert)

//Obtener TODO: cambiar url para obtener el propio usuario
perm.add("getSelf", [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
users.get('/self', validateToken, validatePermission("getSelf"), getSelf)

//Listar
perm.add("getList", [SUPER, STTM])
users.get('/', validateToken, validatePermission("getList"), genericGetList)

//Actualizar password 
perm.add("updatePass", [SUPER, STTM, SUPERVISOR, AUX, CLIENT])
users.put('/pass', validateToken, validatePermission("updatePass"), updatePass)

//Actualizar
perm.add("update", [SUPER, STTM])
users.put('/:id', validateToken, validatePermission("update"), update)

//Eliminar
perm.add("delete", [SUPER, STTM])
users.delete("/:id", validateToken, validatePermission("delete"), genericDelete)

//Reiniciar password TODO: cambiar la url a ingles
perm.add("resetPass", [SUPER, STTM])
users.put('/:id/reset', validateToken, validatePermission("resetPass"), resetPass)

export default { api: users, permissions: perm }

