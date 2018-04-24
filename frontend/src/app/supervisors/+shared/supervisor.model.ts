import { User } from '../../+shared/models/user.model';

export class AuxSupervisor {
    id: string;
    nombre: string;
    celular: string;
    imagen: string;
}

export interface Supervisor extends User {
    auxiliares?: AuxSupervisor[];
}