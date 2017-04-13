import { IMG_USER_DEFAULT } from '../../../config/constants'

export interface IUser {
    tipo?: string
    nombre: string
    cedula: string
    imagen?: string
    celular: string
    usuario: string
    password: string
    activo: boolean
    validado: boolean
}

export class User {
    _id: string
    tipo: string //Cliente | STTP | Supervisor | Auxiliar
    nombre: string
    cedula: string
    imagen: string
    celular: string
    usuario: string
    password: string
    activo: boolean
    validado: boolean

    constructor(obj: IUser = {
        tipo: null
        , nombre: null
        , cedula: null
        , imagen: IMG_USER_DEFAULT
        , celular: null
        , usuario: null
        , password: null
        , activo: false
        , validado: false
    }) {
        
        this.tipo = obj.tipo
        this.nombre = obj.nombre
        this.cedula = obj.cedula
        this.imagen = obj.imagen
        this.celular = obj.celular
        this.usuario = obj.usuario
        this.password = obj.password
        this.activo = obj.activo
        this.validado = obj.validado

    }

}