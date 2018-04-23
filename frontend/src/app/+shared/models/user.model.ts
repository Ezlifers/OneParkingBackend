export interface User {
    _id?: string;
    tipo?: string; //Cliente | STTP | Supervisor | Auxiliar
    nombre: string;
    cedula: string;
    imagen: string;
    celular: string;
    usuario?: string;
    // password: string;
    activo?: boolean;
    // validado: boolean;
}