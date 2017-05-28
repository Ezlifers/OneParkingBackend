import { Router } from 'express'
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index'
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT} from '../../config/constants'
import { getList } from './services/_index'
//import {  } from '../_generic/_index'

export const TRANSACTIONS = 'transacciones'

const api = Router()
const perm = new ResourcePermisions(TRANSACTIONS)
api.use(selectCollection(TRANSACTIONS))

perm.add('getList', [SUPER, STTM])
api.get('/', validateToken, validatePermission('getList'), getList)

export default {api:api, permissions: perm} 