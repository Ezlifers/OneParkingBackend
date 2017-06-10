import { User } from './user'
import { ObjectID } from 'mongodb'

export class Shedule {
    ti: number; //Tiempo inicial (min)
    tf: number; //Tiempo final (min)
    d: boolean; //Disponibilidad 
    dias: number[]; // 0 - 6
}

export class Zone {
    //TODO: acomodar id Zone
    id: ObjectID;
    nombre: string;
    direccion: string;
    codigo: number;
    defaultTiempos: boolean;
    horarios: Shedule[];

}

export class Aux extends User {
    dispositivo: string;
    zonas: Zone[];
    version: number;
}