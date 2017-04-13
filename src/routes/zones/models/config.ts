export class TimeDescription{
    d:boolean // Disponible o no
    ti:number // inicio de franja (min)
    tf:number // fin de franja (min)
    //TODO: Cambiar precio gp por dp
    dp:boolean // Precio por defecto
    p:number // precio
}

export class TimeRange{
    tipo:string
    //TODO: cambiar tiempso por horarios
    horarios:TimeDescription[]
}

export class Config {
    defaultTiempoMax?:boolean
    tiempoMax?:number // Sec
    defaultTiempoMin?:boolean
    tiempoMin?:number // Sec
    defaultTiempoExtra?:boolean
    tiempoExtra?:number
    //TODO: cambiar tiempoUSO por tiempos
    defaultTiempos?:boolean
    tiempos?:TimeRange[]
}