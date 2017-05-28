import { ObjectID } from 'mongodb'
import { getOneToFailRes, pushToSimpleRes } from '../../../util/_index'
import { DEFAULT_USER_CAR } from '../../../config/constants'
import { Client, Car } from '../../users/models/_index'

class Response {
    constructor(private success: boolean, private outRange: boolean) { }
}

export function addCar(req, res, next) {

    let maxCars = req.app.get(DEFAULT_USER_CAR)
    let car:Car = req.body
    console.log("ID:"+req.idSelf)
    getOneToFailRes(res, req.collection, { _id: req.idSelf }, null, (doc) => {

        let client: Client = doc
        if (client.vehiculos.length < maxCars) {

            pushToSimpleRes(res, req.collection, req.idSelf, {vehiculos: car})

        }else{
            res.send(new Response(false, true))
        }

    })

}