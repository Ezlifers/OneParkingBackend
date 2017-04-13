import { User } from "../models/_index"
import { HmacSHA1 } from 'crypto-js'
import { saveUserImage } from "../../../util/img-util"
import { insertToRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'

class Response {
    constructor(private success: boolean
        , private id: string
        , private failImage: boolean) { }
}

export function insert(req, res, next) {

    let secret: string = CONFIG.secret
    let user: User = req.body

    user.usuario = `${user.usuario}`
    user.cedula = `${user.cedula}`
    user.password = `${HmacSHA1(user.cedula, secret)}`
    user.activo = true
    user.validado = false

    saveUserImage(user.imagen, (path) => {
        user.imagen = path
        insertUser(res, req.collection, user)
    }, (defaultImg) => {
        user.imagen = defaultImg
        insertUser(res, req.collection, user)
    }, () => {
        res.send(new Response(false, null, true))
    })
}

function insertUser(res, collection, user) {

    insertToRes(res, collection, user, (id) => {
        return new Response(true, `${id}`, false)
    }, () => {
        return new Response(false, null, false)
    })

}