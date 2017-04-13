import { User, IUser } from "./user"
import { STTM } from '../../../config/constants'

export interface ISttm extends IUser { }

export class Sttm extends User {

    constructor(obj?: ISttm) {
        super(obj)
        this.tipo = STTM
    }

}