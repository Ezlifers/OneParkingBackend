import { User } from "./user"
import { ObjectID } from 'mongodb'

export class Aux {
    //TODO: Acomodar id de AUX
    id:ObjectID
    nombre:string
    celular:string
    imagen:string
}

export class Supervisor extends User {
    auxiliares:Aux[]
}