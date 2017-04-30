import { ObjectID } from 'mongodb'
import { Car } from '../../users/models/_index'
import { User } from '../../reserves/models/_index'


export class Reserve {
    //TODO: actualizar idReserva por id
    id: ObjectID
    fecha: Date
    costo: number
    tiempo: number//Seg
    //TODO: Actualizar la reserva con el usuairo interno junto con id
    usuario: User
    vehiculo: Car
    //TODO: cambiar detenido por suspendida
    suspendida: boolean
}
export class Bay {
    dis: boolean
    index:number
    reserva: Reserve
}
