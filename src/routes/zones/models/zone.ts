import { ObjectID } from 'mongodb'
import { Bay, Config, State } from './_index'

export class Point{
    cordinates:number[]
    readonly type = "Point"
}

export class ZoneBase {
    _id: ObjectID
    localizacion:Point
    codigo: number
    nombre: string
    direccion: string
}

export class Zone extends ZoneBase {
    //TODO: Actulizar el nombre de nBahias a bahias, se quita el numero de bahias (por analizar)
    bahias: Bay[]
    configuracion: Config
    estado?:State

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

