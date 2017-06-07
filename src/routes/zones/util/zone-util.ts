import { IConfig } from '../../config/models/_index';
import { cacheConfig } from '../../../util/cache-util';
import { Zone, State } from '../models/_index';
import { Query } from '../../../util/response-util';

export class QueryZone extends Query {
    times: string //all, none, description    
    disability: boolean
    state: boolean
    bays: boolean
    lite: boolean
    location: boolean

    constructor(query: any) {
        super(query)
        this.times = query.times ? query.times : 'description'
        this.state = query.state ? query.state == 'true' : false
        this.bays = query.bays ? query.bays == 'true' : false
        this.disability = query.disability ? query.disability == 'true' : false
        this.location = query.location ? query.location == 'true' : true
        this.lite = query.lite ? query.lite == 'true' : false
        this.projection = { version:0}

        if (this.times == 'none') {
            this.projection.tiempos = 0;
            this.projection.defaultTiempos = 0;
        }


        if (!this.location)
            this.projection.localizacion = 0

        if (!this.bays && !this.state)
            this.projection.bahias = 0

        if (this.lite) {
            this.projection.nombre = 0
            this.projection.direccion = 0
            this.projection.localizacion = 0
            this.projection.codigo = 0
                
        }
    }
}

export function setUpTimes(zone: Zone, config: IConfig, type: string) {
    if (zone.defaultTiempos)
        zone.tiempos = config.tiempos
    if (type == 'description') {
        delete zone.defaultTiempos
    }
}

export function makeState(zone: Zone, current: Date, showDis: boolean): State {
    let bays = zone.bahias
    let currentSec = current.getTime() / 1000
    let freeTime = 0

    let state: State = { libre: null, bahias: 0, bahiasOcupadas: 0 }
    if (showDis) {
        state.dis = 0
        state.disOcupadas = 0
    }

    for (let bay of bays) {
        let reserve = bay.reserva

        if (reserve != null && !reserve.suspendida) {
            let timeSec = reserve.fecha.getTime() / 1000
            timeSec += reserve.tiempo
            if (currentSec < timeSec) {
                if (freeTime < timeSec)
                    freeTime = timeSec

                if (showDis && bay.dis)
                    state.disOcupadas++
                else if (!bay.dis)
                    state.bahiasOcupadas++
            }
        }

        if (showDis && bay.dis)
            state.dis++
        else if (!bay.dis)
            state.bahias++
    }

    if (freeTime > 0) {
        freeTime *= 1000
        state.libre = new Date(freeTime)
    }

    return state
}

export function setUpState(zone: Zone, current: Date, showDis: boolean, showBays: boolean) {
    let state = makeState(zone, current, showDis)
    zone.estado = state
    if (!showBays) {
        delete zone.bahias
    }
}

export function setUpZone(req: any, current: Date, query: QueryZone, zones: Zone[]): Promise<any> {
    let promise = new Promise((resolve) => {
        if (query.times != 'none' || query.state) {
            cacheConfig(req, config => {
                for (let zone of zones) {
                    if (query.state) {
                        setUpState(zone, current, query.disability, query.bays)
                    }
                    if (query.times != 'none')
                        setUpTimes(zone, config, query.times)
                }
            });
        }
        resolve()
    })
    return promise
}