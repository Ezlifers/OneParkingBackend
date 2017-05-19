import {ObjectID} from 'mongodb'

export const RESERVE = "reserva"
export const EXTEND_RESERVE = "extenderReserva"
export const STOP_RERSERVE = "suspenderReserva"
export const RECHARGE = "recarga"


export class User{
    id:ObjectID
    tipo:string
    saldoRestante?:number
}
export class Client{
    id:ObjectID
    nombre:string
    email:string
    celular:string
}
export class Transaction{
    fecha:Date
    tipo:string
    usuario:User
    para?:Client    
    reserva?:ObjectID
    valor?:number
    remuneracion?:number
}