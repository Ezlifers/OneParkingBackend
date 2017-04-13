const VALIDATE_MIN = 120000

export function validate(timestamp:number):boolean{
    let d:Date = new Date();

    let miliseconds:number = d.getTime()
    let min:number = miliseconds - VALIDATE_MIN
    let max:number = miliseconds + VALIDATE_MIN

    if (timestamp == min || (timestamp > min && timestamp <= max)) {
        return true
    } else {
        return false
    }

}

export function toUTC(date:string){
    let dateRequest = new Date(date)
    let timeZone = new Date().getTimezoneOffset() * 60000
    return new Date(dateRequest.getTime() + timeZone)
}