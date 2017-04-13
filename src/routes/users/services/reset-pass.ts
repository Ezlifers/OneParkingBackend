import { ObjectID } from 'mongodb'
import { HmacSHA1 } from 'crypto-js'
import { updateToSimpleRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'

interface RequestBody {
    password: string
    validado?: boolean // Optional    
}

export function resetPass(req, res, next) {
    let secret = CONFIG.secret
    let body: RequestBody = req.body
    let pass = body.password
    let id = new ObjectID(req.params.id)

    body.password = `${HmacSHA1(pass, secret)}`
    body.validado = false
    
    updateToSimpleRes(res, req.collection, { _id: id }, body)
}

