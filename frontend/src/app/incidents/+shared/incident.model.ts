export class ZoneIncident {
    id: string;
    codigo: number;
    bahia: number;
    nombre: string;

}

export class UserIncident {
    id: string;
    nombre: string;
    celular: string;
    tipo: string;
}

export class Incident {
    _id: string;
    fecha: Date;
    foto: string;
    observaciones: string;
    placa: string;
    zona: ZoneIncident;
    usuario: UserIncident;
    atendida: boolean;
    fechaAtencion: Date;
}