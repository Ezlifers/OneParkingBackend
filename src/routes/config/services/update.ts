import { IConfig } from '../models/_index'
import { updateToSimpleRes } from '../../../util/response-util'
import { CONFIG_ID, DEFAULT_PRICE, DEFAULT_TIME_EXTRA, DEFAULT_TIME_MAX, DEFAULT_TIME_MIN, DEFAULT_TIMES, DEFAULT_USER_CAR } from '../../../config/constants'
import { ObjectID } from 'mongodb';

export function update(req, res, next) {
    let app = req.app
    let id = new ObjectID(app.get(CONFIG_ID))
    let config = req.body as IConfig
    updateToSimpleRes(res, req.collection, { _id: id }, config, () => {
        app.set(DEFAULT_PRICE, config.precio)
        app.set(DEFAULT_USER_CAR, config.vehiculosUsuario)
        app.set(DEFAULT_TIME_MAX, config.tiempoMax)
        app.set(DEFAULT_TIME_MIN, config.tiempoMin)
        app.set(DEFAULT_TIME_EXTRA, config.tiempoExtra)
        app.set(DEFAULT_TIMES, config.tiempos)
    })
}