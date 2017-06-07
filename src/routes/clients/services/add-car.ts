import { cacheConfig } from '../../../util/cache-util';
import { ObjectID } from 'mongodb';
import { getOneToFailRes, pushToSimpleRes } from '../../../util/_index';
import { Client, Car } from '../../users/models/_index';
import { IConfig } from '../../config/models/_index';

class Response {
    constructor(private success: boolean, private outRange: boolean) { }
}

export function addCar(req, res, next) {
    cacheConfig(req, (config: IConfig) => {
        let maxCars = config.vehiculosUsuario;
        let car: Car = req.body;

        getOneToFailRes(res, req.collection, { _id: req.idSelf }, null, (doc) => {
            let client: Client = doc;
            if (client.vehiculos.length < maxCars) {
                pushToSimpleRes(res, req.collection, req.idSelf, { vehiculos: car });
            } else {
                res.send(new Response(false, true));
            }
        });
    });
}