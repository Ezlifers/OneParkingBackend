import { ObjectID } from 'mongodb';
import { updateToSimpleRes } from '../../../util/_index';


export function deleteSupervisor(req, res, next){
    let id = new ObjectID(req.params.id);
    updateToSimpleRes(res, req.collection, {_id: id}, {activo:false});    
}