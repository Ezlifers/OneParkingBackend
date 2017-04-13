import { USERS } from '../../users/api';
import { ObjectID } from 'mongodb';
import { deleteToSimpleRes, ResponseSimple } from '../../../util/_index';
import { AUX } from '../../../config/constants';

export function deleteZone(req, res, next){
    let id = req.params.id;
    let userCollection = req.db.collection(USERS);

    userCollection.updateMany({tipo:AUX, "zonas.id": id}, { $pull: {zonas:{id:id}} }).then(() => {
        deleteToSimpleRes(res, req.collection, new ObjectID(id));
    }, () => {
        res.send(new ResponseSimple(false));
    });    
}