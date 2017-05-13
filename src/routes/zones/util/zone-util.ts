import { Application } from 'express'
import { Zone, State } from '../models/_index'
import { Query } from '../../../util/response-util'
import { DEFAULT_PRICE, DEFAULT_TIME_EXTRA, DEFAULT_TIME_MAX, DEFAULT_TIME_MIN, DEFAULT_TIMES } from '../../../config/constants'

export class QueryZone extends Query {
    settings: boolean
    //TODO:Cambiar global por defaults
    defaults: boolean
    disability: boolean
    state: boolean
    bays: boolean
    lite: boolean
    tempSettings: boolean;

    constructor(query: any) {
        super(query)
        this.settings = query.settings ? query.settings == 'true' : false
        this.defaults = query.defaults ? query.defaults == 'true' : false
        this.state = query.state ? query.state == 'true' : false
        this.bays = query.bays ? query.bays == 'true' : false
        this.disability = query.disability ? query.disability == 'true' : false
        this.lite = query.lite ? query.lite == 'true' : false
        this.projection = {}
        
        if(this.state){
            this.tempSettings = !this.settings;
            this.settings = true;
        }
        
        if (!this.settings)
            this.projection.configuracion = 0

        if (!this.bays && !this.state)
            this.projection.bahias = 0

        if (this.lite) {
            this.projection.nombre = 0
            this.projection.direccion = 0
            this.projection.lat = 0
            this.projection.lon = 0
        }

    }
}

export function setUpDefaults(zone: Zone, app: Application, defaults: boolean) {
    let config = zone.configuracion

    if (config.defaultTiempoMax)
        config.tiempoMax = app.get(DEFAULT_TIME_MAX)
    if (config.defaultTiempoMin)
        config.tiempoMin = app.get(DEFAULT_TIME_MIN)
    if (config.defaultTiempoExtra)
        config.tiempoExtra = app.get(DEFAULT_TIME_EXTRA)
    if (config.defaultTiempos)
        config.tiempos = app.get(DEFAULT_TIMES)

    for (let tiempo of config.tiempos) {
        for (let horario of tiempo.horarios) {
            if (horario.dp)
                horario.p = app.get(DEFAULT_PRICE)
            if (!defaults)
                delete horario.dp
        }
    }

    if (!defaults) {
        delete config.defaultTiempoExtra
        delete config.defaultTiempoMax
        delete config.defaultTiempoMin
        delete config.defaultTiempos
    }

}

export function makeState(zone:Zone, current:Date, showDis:boolean, app:Application):State{
    let bays = zone.bahias
    let currentSec = current.getTime() / 1000
    let freeTime = 0

    let extra = 0
    if(zone.configuracion.defaultTiempoExtra)
        extra = app.get(DEFAULT_TIME_EXTRA)
    else
        extra = zone.configuracion.tiempoExtra
    

    let state: State = { libre: null, bahias: 0, bahiasOcupadas: 0 }
    if (showDis) {
        state.dis = 0
        state.disOcupadas = 0
    }

    for (let bay of bays) {
        let reserve = bay.reserva

        if (reserve != null && !reserve.suspendida) {
            let timeSec = reserve.fecha.getTime() / 1000
            timeSec += reserve.tiempo + extra
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

export function setUpState(zone: Zone, current: Date, showDis: boolean, showBays: boolean, app:Application) {
    
    let state = makeState(zone, current, showDis, app)

    if (!showBays) {
        delete zone.bahias
    }

    zone.estado = state

}

export function setUpZone(app: Application, current: Date, query: QueryZone, zones: Zone[]): Promise<any> {
    let promise = new Promise((resolve) => {
        if (query.settings || query.state) {
            for (let zone of zones) {
                if (query.state){
                    setUpState(zone, current, query.disability, query.bays, app)
                    delete zone.bahias;
                    if(query.tempSettings){
                        query.settings = false;
                        delete zone.configuracion;
                    }
                }
                if (query.settings)
                    setUpDefaults(zone, app, query.defaults)                
            }            
        }
        resolve()
    })
    return promise
}