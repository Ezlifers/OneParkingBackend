import { User } from '../../+shared/models/user.model';

export interface ScheduleAux {
    ti: number;
    tf: number;
    d: boolean;
    dias: number[];
}

export interface ZoneAux {
    id: string;
    nombre: string;
    direccion: string;
    codigo: number;
    defaultTiempos: boolean;
    horarios: ScheduleAux[];
}

export interface Aux extends User {
    dispositivo: string;
    zonas?: ZoneAux[];
    version?: number;
}