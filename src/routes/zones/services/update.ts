import { ObjectID } from 'mongodb';
import { updateToSimpleRes, ResponseSimple } from '../../../util/response-util';
import { ZoneBase } from '../models/_index';
import { USERS } from '../../users/api';
import { AUX } from '../../../config/constants';

export function updateZone(req, res, next) {
    const id = new ObjectID(req.params.id)
    const body: ZoneBase = req.body
    const userCollection = req.db.collection(USERS);

    userCollection.updateMany({ tipo: AUX, "zonas.id": req.params.id }
        , {
            $set: {
                "zonas.$.nombre": body.nombre
                , "zonas.$.codigo": body.codigo
                , "zonas.$.direccion": body.direccion
                , "zonas.$.lat": body.lat
                , "zonas.$.lon": body.lon
            }
        }).then(result => {
            updateToSimpleRes(res, req.collection, { _id: id }, body);
        }).catch(err => {
            res.send(new ResponseSimple(false));
        });

}