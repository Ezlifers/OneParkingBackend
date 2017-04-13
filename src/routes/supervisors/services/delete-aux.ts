import { pullToSimpleRes } from '../../../util/response-util';
import { ObjectID } from 'mongodb';

export function deleteAux(req, res, next) {
    let id = new ObjectID(req.params.id);
    let idAux = req.params.idAux;
    pullToSimpleRes(res, req.collection, id, { auxiliares: { id: idAux } });
}