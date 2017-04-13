import { pushToSimpleRes } from "../../../util/response-util";
import { SupervisorAux } from '../../users/models/_index';
import { ObjectID } from 'mongodb';

export function addAux(req, res, next) {
    let id = new ObjectID(req.params.id);
    let auxs = req.body as SupervisorAux;
    pushToSimpleRes(res, req.collection, id, { auxiliares: auxs  });
}