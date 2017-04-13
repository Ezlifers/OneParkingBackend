import { HmacSHA1 } from 'crypto-js'
import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'

interface RequestBody {
    password: string 
    validado?: boolean //Optional
}

export function updatePass(req, res, next) {
    let body: RequestBody = req.body
    let secret = CONFIG.secret
    let pass = body.password
    
    body.password = `${HmacSHA1(pass, secret)}`
    body.validado = true
    updateToSimpleRes(res, req.collection, {_id:req.idSelf}, body)
}