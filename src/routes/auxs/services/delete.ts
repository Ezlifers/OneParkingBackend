import { ObjectID } from 'mongodb';
import { updateToSimpleRes, ResponseSimple } from '../../../util/_index';
import { SUPERVISOR } from '../../../config/constants';

export function deleteAux(req, res, next){
    let id = req.params.id;
    
    req.collection.updateMany({tipo:SUPERVISOR, "auxiliares.id": id}, { $pull: {auxiliares:{id:id}} }).then(() => {
        updateToSimpleRes(res, req.collection, {_id: new ObjectID(id)}, {activo:false});
    }, () => {
        res.send(new ResponseSimple(false));
    });    
}