import { USERS } from '../../users/api';
import { ObjectID } from 'mongodb';
import { pullManyToSimpleRes } from '../../../util/_index';
import { AUX } from '../../../config/constants';

export function deleteAuxs(req, res, next){
    let id = req.params.id;
    let userCollection = req.db.collection(USERS);
    pullManyToSimpleRes(res, userCollection, {tipo:AUX},{zonas:{id:id}});
}