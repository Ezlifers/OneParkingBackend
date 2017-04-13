import { HmacSHA1 } from 'crypto-js'
import { ObjectID } from 'mongodb'
import { User } from '../models/_index'
import { saveUserImage, deleteUserImage, IMG_USER_NAME_DEFAULT } from "../../../util/img-util"
import { updateToRes } from "../../../util/response-util"
import { CONFIG } from '../../../config/main'


class RequestBody extends User {
    imgMod: string
    imgName: string
}

class Response {
    constructor(private success: boolean
        , private imgUrl: string
        , private failImg: boolean) //ERROR
    { }
}

export function update(req, res, next) {

    let user: RequestBody = req.body
    let secret = CONFIG.secret
    let id = new ObjectID(req.params.id)

    if ("password" in user) {
        let pass = user.password
        user.password = `${HmacSHA1(pass, secret)}` 
        user.validado = true
    }

    if (user.imgMod) {

        let name = user.imgName
        if (name != IMG_USER_NAME_DEFAULT) {
            deleteUserImage(name)
        }
        delete user.imgName

        saveUserImage(user.imagen, (path) => {
            user.imagen = path
            updateUser(res, req.collection, id, user, path)
        }, (defaultImg) => {
            user.imagen = defaultImg
            updateUser(res, req.collection, id, user, defaultImg)          
        }, () => {
            res.send(new Response(false, null, true))
        })

    } else {
        updateUser(res, req.collection, id, user, null)
    }
}

function updateUser(res, collection, id, user, imgUrl) {
    delete user.imgMod;
    updateToRes(res, collection, { _id: id }, user, () => {
        return new Response(true, imgUrl, false)
    }, () => {
        return new Response(false, imgUrl, false)
    })
}