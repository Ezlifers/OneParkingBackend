import {ObjectID} from 'mongodb'

export class Zone{
    id:ObjectID
    codigo:number
    bahia:number
}

export class User{
    id:ObjectID;
    tipo:string;
}

export class Client{
    id?:ObjectID;
    placa:string;
    celular?:string;
}


export class Notification{
    fecha?:Date;
    zona:Zone;
    usuario?:User;
    cliente:Client;
    observaciones:string;
}