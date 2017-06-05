import { ObjectID } from 'mongodb'
import { Bay, TimeRange, State } from './_index'

export class Point {
    type: string
    coordinates: number[]    
}

export class ZoneBase {
    _id: ObjectID
    localizacion: Point
    codigo: number
    nombre: string
    direccion: string
    version?: number
}

export class Zone extends ZoneBase {
    
    bahias: Bay[]
    defaultTiempos: Boolean
    tiempos: TimeRange[]
    estado?: State
    tipo?:number
    
    constructor(base?: ZoneBase) {
        super()
        if (base) {
            this._id = base._id
            this.localizacion = base.localizacion
            this.codigo = base.codigo
            this.nombre = base.nombre
            this.direccion = base.direccion
        }
    }
}

