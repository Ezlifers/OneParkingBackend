import { HmacSHA1 } from 'crypto-js'
import { ObjectID } from 'mongodb'
import { saveUserImage, deleteUserImage, IMG_USER_NAME_DEFAULT } from "../../../util/img-util"
import { updateToRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'
import { SUPERVISOR } from '../../../config/constants'

class RequestBody {
    nombre: string
    cedula: string
    celular: string
    dispositivo: string;
    imagen?: string
    imgMod?: string
    imgName?: string
}

class Response {
    constructor(private success: boolean
        , private imgUrl: string
        , private failImg: boolean) //ERROR
    { }
}

export function update(req, res, next) {

    let user: RequestBody = req.body
    let id = new ObjectID(req.params.id)

    if (user.imgMod) {
        let name = user.imgName
        if (name != IMG_USER_NAME_DEFAULT) {
            deleteUserImage(name)
        }
        delete user.imgName

        saveUserImage(user.imagen, (path) => {
            user.imagen = path
            updateUser(req, res, id, user, path)
        }, (defaultImg) => {
            user.imagen = defaultImg
            updateUser(req, res, id, user, defaultImg)
        }, () => {
            res.send(new Response(false, null, true))
        })

    } else {
        updateUser(req, res, id, user, null)
    }
}

function updateUser(req, res, id, user: RequestBody, imgUrl) {
    let auxSupervisor = {
        "auxiliares.$.nombre": user.nombre,
        "auxiliares.$.celular": user.celular        
    };
    if (user.imgMod) {
        auxSupervisor["auxiliares.$.imagen"] = user.imagen;
    }
    delete user.imgMod;
    req.collection.updateMany({ tipo: SUPERVISOR, "auxiliares.id": req.params.id }, {
        $set: auxSupervisor
    }).then(resut => {

        updateToRes(res, req.collection, { _id: id }, user, () => {
            return new Response(true, imgUrl, false)
        }, () => {
            return new Response(false, imgUrl, false)
        })

    }).catch(err => {
        res.send(new Response(false, imgUrl, false));
    });



}