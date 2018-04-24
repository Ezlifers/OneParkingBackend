import { Sttm } from '../routes/users/models/_index'
import { IConfig } from '../routes/config/models/_index'
import { TIME_RANGE, IMG_USER_DEFAULT } from './constants'

export const CONFIG = {
    secret: '0n3P4rK1n6',
    database: 'mongodb://localhost:27017/oneparkingapp2',
    permissionVersion: 2,
    city: 'Popayan',
    limits: {
        p1: {
            lat: 2.464708746725211,
            lon: -76.64701183886717
        },
        p2: {
            lat: 2.4274921707588493,
            lon: -76.58435543627928
        }
    }
}

//TODO: Cambiar el nombre del usuairo inicial
export const INITIAL_USER = new Sttm({
    nombre: "Dario Fernando Chamorro"
    , cedula: "1085277896"
    , imagen: IMG_USER_DEFAULT
    , celular: "3017790935"
    , usuario: "admin"
    , password: "admin"
    , activo: true
    , validado: true
})

export const DEFAULT_BEHAVIOR: IConfig = {
    precio: [500, 1100, 1800, 2600, 3600, 4800, 6200, 7800], // $ x tiempoMin < tiempoMax
    vehiculosUsuario: 5,
    tiempoMax: 7200, //Seg
    tiempoMin: 900,  //Seg
    tiempos: [{ tipo: TIME_RANGE[0], horarios: [{ d: true, ti: 480, tf: 1080 }] }
        , { tipo: TIME_RANGE[1], horarios: [{ d: true, ti: 480, tf: 1080 }] }
        , { tipo: TIME_RANGE[2], horarios: [] }
    ],
    version: 0
}

