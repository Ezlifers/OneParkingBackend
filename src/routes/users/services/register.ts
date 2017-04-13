import { HmacSHA1 } from 'crypto-js'
import { sign } from 'jsonwebtoken'
import { insertToRes } from "../../../util/response-util"
import { Client } from '../models/_index'
import { CONFIG } from '../../../config/main'

class Response {

    constructor(private success: boolean
        , private token: string
        , private id: string
        , private exist: boolean
    ) { }

}

export function register(req, res, next) {

    let secret: string = CONFIG.secret

    let usr: Client = req.body
    let pass = usr.password

    //TODO:password ya no viaja encriptado con aes
    usr.password = `${HmacSHA1(pass, secret)}`
    usr.activo = true
    usr.validado = true
    usr.saldo = 0
    usr.vehiculos = []

    req.collection.findOne({ usuario: usr.usuario }).then((doc) => {

        if (doc == null) {
            insertToRes(res, req.collection, usr, (id) => {
                let token = sign(`${usr.tipo}_&&_${id}`, secret)
                return new Response(true, token, `${id}`, false)
            }, () => {
                return new Response(false, null, null, false)
            })
        } else {
            res.send(new Response(false, null, null, true))
        }

    }, () => {
        res.send(new Response(false, null, null, false))
    })


}