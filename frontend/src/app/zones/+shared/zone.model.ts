export interface User {
    id: string;
    tipo: string;
    celular?: string;
}

export interface Car {
    apodo?: string;
    marca?: string;
    placa: string;
}

export interface TimeDescription {
    d: boolean;
    ti: number;
    tf: number;
}

export interface TimeRange {
    tipo: string;
    horarios: TimeDescription[];
}

export interface State {
    libre: Date;
    bahias: number;
    bahiasOcupadas: number;
    dis?: number;
    disOcupadas?: number;
}

export interface Reserve {
    id: string;
    fecha: Date;
    costo: number;
    tiempo: number;
    usuario: User;
    vehiculo: Car;
    suspendida: boolean;
}

export interface Bay {
    dis: boolean;
    reserva: Reserve;
}

export interface Point {
    type: string;
    coordinates: number[];
}


export interface ZoneBase {
    _id?: string;
    localizacion: Point;
    codigo: number;
    nombre: string;
    direccion: string;
    nBahias?: number; // Solo sirve para insertar
}

export interface Zone extends ZoneBase {
    bahias?: Bay[];
    defaultTiempos?: boolean;
    tiempos?: TimeRange[];
    estado?: State;
}

