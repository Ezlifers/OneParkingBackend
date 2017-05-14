import { clearTimeout, setTimeout } from 'timers';
import { Application } from 'express'
import { Zone, TimeRange } from '../routes/zones/models/_index'
import { Reserve } from '../routes/reserves/models/_index'
import { Cost } from '../routes/reserves/models/_index'
import { DEFAULT_TIMES, DEFAULT_PRICE, DEFAULT_TIME_MIN, DEFAULT_TIME_MAX } from '../config/constants'
import { ioGlobal, ioZones } from '../www';

interface AvailableToken {
    available: boolean
    bay: number
}
export function validateAvailability(zone: Zone, current: Date, disability: boolean): Promise<AvailableToken> {
    let promise = new Promise<AvailableToken>((resolve, reject) => {
        let currentSec = current.getTime() / 1000
        let bays = zone.bahias
        let result: AvailableToken = { available: false, bay: 0 }

        let bayPos = 0

        for (let bay of bays) {
            if (bay.dis == disability) {
                let reserve = bay.reserva
                if (reserve == null || reserve.suspendida == true) {
                    result.available = true
                    result.bay = bayPos
                    break
                } else {
                    let reserveTime = (reserve.fecha.getTime() / 1000) + reserve.tiempo
                    if (currentSec >= reserveTime) {
                        result.available = true
                        result.bay = bayPos
                        break
                    }
                }
            }
            bayPos++
        }

        if (result.available)
            resolve(result)
        else
            reject(Error("Bahia no disponible"))
    })
    return promise
}

export function validateExtend(zone: Zone, bay: number, time: number, app: Application): boolean {

    let reserve = zone.bahias[bay].reserva

    if (reserve == null || reserve.suspendida)
        return true
    else {
        let timeMax = zone.configuracion.defaultTiempoMax ? app.get(DEFAULT_TIME_MAX) : zone.configuracion.tiempoMax
        let timeReq = reserve.tiempo + time
        return timeReq <= timeMax
    }
}

interface freeTimeToken {
    freeTime: number
    retribution: number
}
export function calculateFreeTime(reserve: Reserve, current: Date): Promise<freeTimeToken> {

    let promise = new Promise<freeTimeToken>((resolve, reject) => {

        let result: freeTimeToken = { freeTime: 0, retribution: 0 }
        let reserveStart = reserve.fecha.getTime() / 1000
        let reserveTimeTotal = reserve.tiempoTotal + reserveStart
        let timeDelta = (current.getTime() / 1000) - reserveStart

        let timeUsed = 0
        let costPaid = 0
        let timefounded = false

        if (timeDelta >= 0) {
            for (let cost of reserve.costoInicial) {
                timeUsed += cost.tiempo
                costPaid += cost.valor
                let free = timeDelta - timeUsed
                if (free <= 0) {
                    free *= -1
                    timefounded = true
                    timeUsed -= free
                    costPaid -= (cost.precio * free / reserve.tiempoMin)
                    break
                }
            }
            if (!timefounded) {
                for (let ext of reserve.extensiones) {
                    for (let cost of ext.costo) {
                        timeUsed += cost.tiempo
                        costPaid += cost.valor
                        let free = timeDelta - timeUsed
                        if (free <= 0) {
                            free *= -1
                            timefounded = true
                            timeUsed -= free
                            costPaid -= (cost.precio * free / reserve.tiempoMin)
                            break
                        }
                    }
                }
            }

            result.freeTime = reserveTimeTotal - timeUsed

            let retribution = reserve.costoTotal - costPaid
            retribution = retribution - (retribution % 100)
            result.retribution = retribution

            resolve(result)
        } else {
            reject()
        }
    })

    return promise
}

interface CostToken {
    cost?: number
    time?: number
    description?: Cost[]
    minTime?: number

}
export function calculateCost(zone: Zone, time: number, current: Date, app: Application): Promise<CostToken> {

    let promise = new Promise<CostToken>((resolve, reject) => {
        let result: CostToken = { time: time }
        let times: TimeRange[]

        if (zone.configuracion.defaultTiempos)
            times = app.get(DEFAULT_TIMES)
        else
            times = zone.configuracion.tiempos


        let currentDay = current.getDay()
        let day: TimeRange
        if (currentDay < 6 && currentDay > 0)
            day = times[0]
        else if (currentDay == 6)
            day = times[1]
        else
            day = times[2]

        let currentMin = (current.getHours() * 60) + current.getMinutes()
        let timeOut = false
        let timeOutDelta = 0
        let shedulePos = 0

        for (let shedule of day.horarios) {
            if (currentMin >= shedule.ti && currentMin <= shedule.tf) {
                if ((currentMin + (time / 60)) > shedule.tf) {
                    timeOut = true
                    timeOutDelta = ((currentMin - shedule.tf) * 60) + time
                }
                break
            }
            shedulePos++
        }

        let shedule = day.horarios[shedulePos]
        if (shedule.d) {

            let minPrice: number

            if (shedule.dp)
                minPrice = app.get(DEFAULT_PRICE)
            else
                minPrice = shedule.p

            if (zone.configuracion.defaultTiempoMin)
                result.minTime = app.get(DEFAULT_TIME_MIN)
            else
                result.minTime = zone.configuracion.tiempoMin

            if (timeOut) {

                let initialTime = time - timeOutDelta
                result.cost = minPrice * (initialTime / result.minTime)
                result.description = [{ valor: result.cost, tiempo: initialTime, precio: minPrice }]

                let sheduleNextPos = shedulePos + 1
                if (sheduleNextPos >= day.horarios.length || shedule.tf != day.horarios[sheduleNextPos].ti || !day.horarios[sheduleNextPos].d) {

                    result.time = initialTime

                } else {

                    let sheduleNext = day.horarios[sheduleNextPos]
                    if (sheduleNext.dp)
                        sheduleNext.p = app.get(DEFAULT_PRICE)

                    let value = sheduleNext.p * (timeOutDelta / result.minTime)
                    result.description.push({ valor: value, precio: sheduleNext.p, tiempo: timeOutDelta })
                    result.cost += value
                }

            } else {
                result.cost = minPrice * (time / result.minTime)
                result.description = [{ valor: result.cost, tiempo: time, precio: minPrice }]
            }

            result.cost /= 100
            result.cost = Math.round(result.cost)
            result.cost = result.cost * 100
            resolve(result)
        } else {
            reject()
        }

    })
    return promise
}

let RESERVE = 0;
let END_RESERVE = 1;
export let timeReserve = {};

export function reserveAdded(idZone: string, bay: number, time:number){
    ioGlobal.to("states").emit("global_state", {id: idZone, type:RESERVE});
    let timeout = setTimeout(() => { 
        ioGlobal.to("states").emit("global_state", {id: idZone, type:END_RESERVE});
    }, time);
    timeReserve[`${idZone}_${bay}`] = timeout;
}

export function reserveStoped(idZone: string, bay: number){
    let timeout = timeReserve[`${idZone}_${bay}`];
    clearTimeout(timeout);    
    ioGlobal.to("states").emit("global_state", {id: idZone, type:END_RESERVE});
}

export function reserveExtended(idZone:string, bay:number, totalTime:number, date:Date){
    let newTime = totalTime + date.getTime() - Date.now();    
    let timeout = timeReserve[`${idZone}_${bay}`];
    clearTimeout(timeout);    
    let newTimeout = setTimeout(() => { 
        ioGlobal.to("states").emit("global_state", {id: idZone, type:END_RESERVE});
    }, newTime);
    timeReserve[`${idZone}_${bay}`] = timeout;
}