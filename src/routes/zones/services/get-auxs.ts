import { USERS } from '../../users/api';
import { ObjectID } from 'mongodb';
import { getListToSimpleRes, Query } from '../../../util/_index';
import { AUX } from '../../../config/constants';


export function getAuxs(req, res, next) {
    let usersCollection = req.db.collection(USERS);
    let id = req.params.id;
    
    let query: Query = {
        q: {
            tipo:AUX,
            activo: true,
            "zonas.id": id
        }, projection: {
            _id: 1, nombre: 1, cedula: 1, celular: 1, imagen: 1, zonas: { $elemMatch: { id: id } }
        }, sort: {
            nombre: 1
        }, limit: 0, skip: 0
    };

    getListToSimpleRes(res, usersCollection, query);

}