import { User } from "./user"

export class Car {
    apodo?:string
    marca?:string
    placa:string
}

export class Client extends User {

    discapacitado:boolean;
    email:string;
    vehiculos:Car[] ;
    saldo:number;
    ultimaTransaccion:Date;

}