import { cacheVersion } from '../../../util/cache-util';
import { ObjectID } from 'mongodb';
import { updateToSimpleRes, ResponseSimple } from '../../../util/response-util';
import { ZoneBase } from '../models/_index';
import { USERS } from '../../users/api';
import { AUX, DATA_VERSION } from '../../../config/constants';

export function updateZone(req, res, next) {
    const id = new ObjectID(req.params.id);
    const body: ZoneBase = req.body;
    const userCollection = req.db.collection(USERS);
    body.localizacion.type = "Point";
    cacheVersion(req, version => {
        body.version = version + 1;
        userCollection.updateMany({ tipo: AUX, "zonas.id": req.params.id }
            , {
                $set: {
                    "zonas.$.nombre": body.nombre
                    , "zonas.$.codigo": body.codigo
                    , "zonas.$.direccion": body.direccion
                    , "zonas.$.localizacion.coordinates": body.localizacion.coordinates
                }
            }).then(result => {
                req.redis.set(DATA_VERSION, "" + body.version);
                updateToSimpleRes(res, req.collection, { _id: id }, body);
            }).catch(err => {
                res.send(new ResponseSimple(false));
            });

    });
}