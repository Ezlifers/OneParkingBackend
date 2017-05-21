import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/response-util'
import { Config } from '../models/_index'
import { ZONE_VERSION } from '../../../config/constants';

//TODO: cambiar global por default
interface IRequesTime {
    default: boolean
    value: number
}

interface RequestBody {
    tiempoMax: IRequesTime
    tiempoMin: IRequesTime
}

export function updateTimes(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body
    let config: Config = {
        defaultTiempoMax: body.tiempoMax.default
        , tiempoMax: body.tiempoMax.default ? 0 : body.tiempoMax.value
        , defaultTiempoMin: body.tiempoMin.default
        , tiempoMin: body.tiempoMin.default ? 0 : body.tiempoMin.value
    }
    const version = req.app.get(ZONE_VERSION) + 1;
    req.app.set(ZONE_VERSION, version)

    let updated = { version: version }

    for (let prop in config)
        updated["configuracion." + prop] = config[prop]

    updateToSimpleRes(res, req.collection, { _id: id }, updated)
}