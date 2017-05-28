import { TimeRange } from '../../zones/models/_index'
import { ObjectID } from 'mongodb'

export interface IConfig {
    precio: number[]
    vehiculosUsuario: number
    tiempoMax: number //Sec
    tiempoMin: number //Sec
    tiempos: TimeRange[]
}

