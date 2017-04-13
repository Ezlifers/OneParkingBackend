import { validate } from "../../../util/date-util"
import { HmacSHA1 } from 'crypto-js'
import { sign } from 'jsonwebtoken'
import { getOneToRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'
import { PERMISSIONS } from '../../../config/constants'

interface RequestBody {
    //TODO: cambiar type por role
    role?: string
    roles?: string[]
    //TODO: enviar directamente el user y pass en lugar de auth
    user: string
    password: string // Sin AES
    timestamp: number

}

class Response {
    constructor(private success: boolean
        , private token: string
        , private user: Object
        , private permissions: Object
        , private timeout: Boolean //Error
    ) { }
}

export function login(req, res, next) {

    let secret: string = CONFIG.secret
    let body: RequestBody = req.body

    let usr = body.user
    let pass = body.password

    pass = `${HmacSHA1(pass, secret)}`

    let time = body.timestamp

    if (validate(time)) {

        let query: any = { usuario: usr, password: pass, activo: true }

        body.role
        if (body.role) {
            query.tipo = body.role
        } else if (body.roles) {
            query.tipo = { $in: body.roles }
        }

        getOneToRes(res, req.collection, query, {}, (doc) => {
            let token = sign(`${doc.tipo}_&&_${doc._id}`, secret)
            let permissions = req.app.get(PERMISSIONS)[doc.tipo]
            return new Response(true, token, doc, permissions, false)
        }, () => {
            return new Response(false, null, null, null, false)
        })
    } else {
        res.send(new Response(false, null, null, null, true))
    }


}