import { USERS } from '../../users/api';
import { ObjectID } from 'mongodb';
import { pullManyToSimpleRes, ResponseSimple } from '../../../util/_index';
import { AUX } from '../../../config/constants';

export function deleteAuxs(req, res, next) {
    let id = req.params.id;
    let userCollection = req.db.collection(USERS);

    userCollection.updateMany({ tipo: AUX }, { $pull: { zonas: { id: id } }, $inc: { version: 1 } }).then(() => {
        res.send(new ResponseSimple(true));
    }, () => {
        res.send(new ResponseSimple(false));
    });    
}