import {ObjectID} from 'mongodb'

export const RESERVE = "reserva"
export const EXTEND_RESERVE = "extenderReserva"
export const STOP_RERSERVE = "suspenderReserva"



export class User{
    id:ObjectID
    tipo:string
    saldoRestante?:number
}
export class Transaction{
    fecha:Date
    usuario:User
    tipo:string
    reserva?:ObjectID
    valor?:number
    remuneracion?:number
}