import { getOneToFailRes } from '../../../util/response-util'
import { CONFIG_ID, DEFAULT_PRICE, DEFAULT_TIME_MAX, DEFAULT_TIME_MIN, DEFAULT_TIMES, DEFAULT_USER_CAR } from '../../../config/constants'
import { IConfig } from '../models/_index';
import { ObjectID } from 'mongodb';

export function get(req, res, next) {
    //const id = new ObjectID(req.app.get(CONFIG_ID));
    let app = req.app;
    let config:IConfig = {vehiculosUsuario: app.get(DEFAULT_USER_CAR)
        , precio: app.get(DEFAULT_PRICE)
        , tiempoMax: app.get(DEFAULT_TIME_MAX)
        , tiempoMin: app.get(DEFAULT_TIME_MIN)
        , tiempos: app.get(DEFAULT_TIMES)
    }
    res.send(config);
    /*getOneToFailRes(res, req.collection, { _id: id }, {}, (config: IConfig) => {
        res.send(config);
    });*/
}