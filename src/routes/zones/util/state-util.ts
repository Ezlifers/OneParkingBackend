import { Application } from 'express'
import { DEFAULT_TIMES } from '../../../config/constants'
import { TimeRange } from '../models/_index'

export function defaultTimesActive(day:number, hour:number, app:Application):boolean{
    let active = false;
    let times:TimeRange[] = app.get(DEFAULT_TIMES);
    for(let h of times[day].horarios){
        if(hour >= h.ti && hour < h.ti && h.d){
            active = true;
            break;
        }
    }
    return active;
}