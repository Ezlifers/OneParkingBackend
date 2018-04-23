import { TimeRange } from '../../zones/+shared/_index';

export interface Config {
    precio: number[];
    vehiculosUsuario: number;
    tiempoMax: number;
    tiempoMin: number;
    tiempos: TimeRange[];
}

