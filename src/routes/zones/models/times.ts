export class TimeDescription{
    d:boolean // Disponible o no
    ti:number // inicio de franja (min)
    tf:number // fin de franja (min)    
}

export class TimeRange{
    tipo:string
    horarios:TimeDescription[]
}
