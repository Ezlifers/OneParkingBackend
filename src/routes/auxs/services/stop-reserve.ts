import { ZONES } from '../../zones/api'
import { RESERVES } from '../../reserves/api'
import { TRANSACTIONS } from '../../transactions/api'
import { Reserve } from '../../reserves/models/_index'
import { Transaction, STOP_RERSERVE } from '../../transactions/models/_index'
import { getOneToFailRes, calculateFreeTime } from '../../../util/_index'
import { AUX } from '../../../config/constants'
import { Collection, ObjectID } from 'mongodb'

class Response {
    constructor(private success: boolean
        , private retribution: number) { }

}

export function stopReserve(req, res, next) {

    let id = new ObjectID(req.params.id)

    let reserveCollection: Collection = req.db.collection(RESERVES)
    let transactionCollection: Collection = req.db.collection(TRANSACTIONS)
    let zoneCollection: Collection = req.db.collection(ZONES)

    let current = new Date()

    getOneToFailRes(res, reserveCollection, { _id: id }, null, (doc) => {
        let reserve: Reserve = doc

        zoneCollection.updateOne({ _id: new ObjectID(doc.zona.id) }, { $set: { [`bahias.${reserve.zona.bahia}.reserva.suspendida`]: true } })

        calculateFreeTime(reserve, current).then((freeToken) => {
            reserveCollection.update({_id:id},{$set:{suspendida:true, fechaSuspencion:current, tiempoLibre:freeToken.freeTime, remuneracion: freeToken.retribution}})
            let transaction:Transaction={
                fecha: current,
                tipo: STOP_RERSERVE,
                usuario: { id: req.idSelf, tipo: AUX },
                reserva: id,
                remuneracion: freeToken.retribution
            }
            transactionCollection.insertOne(transaction)
            res.send(new Response(true, freeToken.retribution))
        }, () => {
            res.send(new Response(false, null))
        })
    })

}