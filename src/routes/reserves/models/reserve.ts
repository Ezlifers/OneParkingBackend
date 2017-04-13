import { ObjectID } from 'mongodb'
import { Car } from '../../users/models/_index'

export interface Zone {
    id: ObjectID
    codigo: number
    bahia: number
}

export interface User {
    id: ObjectID
    tipo: string
    celular?: string
}

export interface Cost {
    tiempo: number
    valor: number
    precio: number
}

export interface Extension{
    fecha:Date
    costo:Cost[]
}

export interface Reserve {
    _id?: ObjectID
    fecha: Date
    zona: Zone
    usuario: User
    vehiculo: Car
    discapacidad: boolean
    tiempoMin: number
    tiempoTotal: number
    costoInicial: Cost[]
    costoTotal: number
    extensiones:Extension[]
    suspendida: boolean
    fechaSuspencion?: Date
    tiempoLibre?: number
    remuneracion?: number
}