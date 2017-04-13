import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT} from '../../config/constants'
import { getList, insert, attend } from './services/_index'

export const INCIDENTS = 'incidencias'

const api = Router()
const perm = new ResourcePermisions(INCIDENTS)
api.use(selectCollection(INCIDENTS))

//Insertar
perm.add("insert", [SUPER, AUX, CLIENT])
api.post("/", validateToken, validatePermission("insert"), insert)

//Listar
perm.add("getList", [SUPER, STTM, SUPERVISOR])
api.get("/", validateToken, validatePermission("getList"), getList)

//Atender
perm.add("attend", [SUPER, STTM, SUPERVISOR])
api.put("/:id", validateToken, validatePermission("attend"), attend)

export default {api:api, permissions: perm} 