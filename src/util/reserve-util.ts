import { clearTimeout, setTimeout } from 'timers';
import { Application } from 'express'
import { Zone, TimeRange } from '../routes/zones/models/_index'
import { Reserve } from '../routes/reserves/models/_index'
import { Reserve as ZoneReserve } from '../routes/zones/models/_index'
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
        let timeMax = app.get(DEFAULT_TIME_MAX)
        let timeReq = reserve.tiempo + time
        return timeReq <= timeMax
    }
}

interface freeTimeToken {
    freeTime: number
    retribution: number
}
export function calculateFreeTime(reserve: Reserve, current: Date, app: Application): Promise<freeTimeToken> {

    let promise = new Promise<freeTimeToken>((resolve, reject) => {

        let result: freeTimeToken = { freeTime: 0, retribution: 0 }
        let reserveStart = reserve.fecha.getTime() / 1000
        let reserveTimeTotal = reserve.tiempoTotal + reserveStart
        let timeOut = reserveTimeTotal - current.getTime() / 1000

        if (timeOut >= 0) {
            result.freeTime = timeOut
            let timePaid = (current.getTime() / 1000) - reserveStart
            let timeMin = app.get(DEFAULT_TIME_MIN)
            let prices: number[] = app.get(DEFAULT_PRICE)
            let pricePosition = Math.round((timePaid / timeMin) - 1)
            if (timePaid % timeMin > 0) {
                pricePosition++
            }
            let costPaid = prices[pricePosition]
            result.retribution = reserve.costoTotal - costPaid
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
    description?: Cost
    minTime?: number

}
export function calculateCost(zone: Zone, time: number, current: Date, app: Application, timeReserved: number = 0): Promise<CostToken> {

    let promise = new Promise<CostToken>((resolve, reject) => {

        let result: CostToken = { time: time }
        let times: TimeRange[] = zone.defaultTiempos ? app.get(DEFAULT_TIMES) : zone.tiempos

        let currentDay = current.getDay()
        let day: TimeRange
        if (currentDay < 6 && currentDay > 0)
            day = times[0]
        else if (currentDay == 6)
            day = times[1]
        else
            day = times[2]

        let currentMin = (current.getHours() * 60) + current.getMinutes()
        let shedulePos = 0

        for (let shedule of day.horarios) {
            if (currentMin >= shedule.ti && currentMin <= shedule.tf) {
                if ((currentMin + (time / 60)) > shedule.tf) {
                    const timeOutDelta = ((currentMin - shedule.tf) * 60) + time
                    time = time - timeOutDelta
                }
                break
            }
            shedulePos++
        }

        let shedule = day.horarios[shedulePos]
        if (shedule.d) {

            let prices: number[] = app.get(DEFAULT_PRICE)
            let timeMin = app.get(DEFAULT_TIME_MIN)

            let pricePosition = Math.round(((time + timeReserved) / timeMin) - 1)
            if (time % timeMin > 0) {
                pricePosition++
            }

            result.cost = prices[pricePosition]
            result.description = { valor: result.cost, tiempo: time }

            resolve(result)
        } else {
            reject()
        }

    })
    return promise
}

//IO

let RESERVE = 0;
let END_RESERVE = 1;
export let timeReserve = {};

export function reserveAdded(idZone: string, bay: number, timeReq: number, date: Date, dis: boolean) {
    let time = timeReq + date.getTime() - Date.now();
    ioGlobal.to("states").emit("global_state", { id: idZone, type: RESERVE, dis: dis });
    let timeout = setTimeout(() => {
        ioGlobal.to("states").emit("global_state", { id: idZone, type: END_RESERVE, dis: dis });
    }, time);
    timeReserve[`${idZone}_${bay}`] = timeout;
}

export function reserveStoped(idZone: string, bay: number, dis: boolean) {
    let timeout = timeReserve[`${idZone}_${bay}`];
    clearTimeout(timeout);
    ioGlobal.to("states").emit("global_state", { id: idZone, type: END_RESERVE, dis: dis });
}

export function reserveExtended(idZone: string, bay: number, totalTime: number, date: Date, dis: boolean) {
    let newTime = totalTime + date.getTime() - Date.now();
    let timeout = timeReserve[`${idZone}_${bay}`];
    clearTimeout(timeout);
    let newTimeout = setTimeout(() => {
        ioGlobal.to("states").emit("global_state", { id: idZone, type: END_RESERVE, dis: dis });
    }, newTime);
    timeReserve[`${idZone}_${bay}`] = timeout;
}

export function zoneBayUpdated(idZone: string, bay: number, reserve: ZoneReserve) {
    ioZones.to(idZone).emit("reserves", { bay: bay, reserve: reserve });
}