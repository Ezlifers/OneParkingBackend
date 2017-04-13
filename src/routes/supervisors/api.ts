import { Router } from 'express';
import { selectCollection, validateToken, validatePermission, ResourcePermisions } from '../../middlewares/_index';
import { STTM, SUPER, SUPERVISOR, AUX, CLIENT} from '../../config/constants';
import { addAux, deleteAux, deleteSupervisor, getAuxList } from './services/_index';
import { USERS } from '../users/api';

export const SUPERVISORS = 'supervisores';

const api = Router();
const perm = new ResourcePermisions(SUPERVISORS);
api.use(selectCollection(USERS, SUPERVISORS));

//Agregar auxiliar
perm.add('addAux', [SUPER, STTM]);
api.post('/:id/auxiliares', validateToken, validatePermission('addAux'), addAux);

//Obtener lista de auxiliares
perm.add('getAuxList', [SUPER, STTM, SUPERVISOR]);
api.get('/:id/auxiliares', validateToken, validatePermission('getAuxList'), getAuxList);

//Eliminar
perm.add('delete', [SUPER, STTM]);
api.delete('/:id', validateToken, validatePermission('delete'), deleteSupervisor);

//Eliminar Auxiliar
perm.add('deleteAux', [SUPER, STTM]);
api.delete('/:id/auxiliares/:idAux', validateToken, validatePermission('deleteAux'), deleteAux);

export default {api:api, permissions: perm}; 