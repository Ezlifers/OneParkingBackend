import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/response-util'
import { Config } from '../models/_index'

//TODO: cambiar global por default
interface IRequesTime {
    default: boolean
    value: number
}

interface RequestBody {
    tiempoMax: IRequesTime
    tiempoMin: IRequesTime
    tiempoExtra: IRequesTime
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

    let updated = {}

    for (let prop in config)
        updated["configuracion." + prop] = config[prop]

    updateToSimpleRes(res, req.collection, { _id: id }, updated)
}