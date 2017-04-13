import { CONFIG } from '../config/main'
import { verify } from 'jsonwebtoken'
import { validate } from '../util/date-util'
import { ObjectID } from 'mongodb'


export function validateToken(req, res, next) {
    // TODO: NO usar base64 solo concatenar timestamp en token
    let tokenFull = req.get("Authorization")
    tokenFull = tokenFull.split("_&&_")

    let token = tokenFull[0]

    if (validate(parseInt(tokenFull[1]))) {

        let secret = CONFIG.secret
        verify(token, secret, function (err, decoded) {
            if (err) {
                //TODO: mensaje actualizado 
                res.status(401).send({ msg: "Acción no authorizada", timeOut: false })
            } else {
                let payload = decoded.split("_&&_")
                //TODO: cambiar tipo por role 
                req.role = payload[0]
                req.idSelf = new ObjectID(payload[1])
                next();
            }
        })
    } else {
        res.status(401).send({ msg: "Accion no autorizada", timeOut: true })
    }    
    
}

