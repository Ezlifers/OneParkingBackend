import { ObjectID } from 'mongodb'

//TODO: cambiar codBahia, codZona, idZona, nombreZona, por un obj
export class Zone{
    id:ObjectID
    codigo:number
    bahia:number
    nombre:string

}

export class User{
    id:ObjectID
    nombre:string
    celular:string
    tipo:string
}

export class Incident{
    _id:ObjectID
    fecha:Date
    foto:string
    observaciones:string
    placa:string
    zona:Zone
    usuario:User
    atendida:boolean
    //TODO: Cambiar fechaAtendida por fechaAtencion
    fechaAtencion:Date
}