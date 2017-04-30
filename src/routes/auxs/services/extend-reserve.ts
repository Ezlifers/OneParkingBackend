import { ZONES } from '../../zones/api'
import { RESERVES } from '../../reserves/api'
import { TRANSACTIONS } from '../../transactions/api'
import { Zone } from '../../zones/models/_index'
import { Transaction, EXTEND_RESERVE } from '../../transactions/models/_index'
import { Extension } from '../../reserves/models/_index'
import { getOneToFailRes, validateExtend, calculateCost } from '../../../util/_index'
import { AUX } from '../../../config/constants'
import { Collection, ObjectID } from 'mongodb'


interface RequestBody {
    id: string // Zone
    codigo: number //Zone
    bahia: number
    tiempo: number //Secs
}

class Response {
    constructor(private success: boolean,
        private bay: number,
        private reservation: string,
        private cost: number,
        private costTotal: number,
        private date: Date,
        private noAvaibility: boolean
    ) { }
}

export function extendReserve(req, res, next) {

    let idReserve = new ObjectID(req.params.id)
    let body: RequestBody = req.body

    let reserveCollection: Collection = req.db.collection(RESERVES)
    let transactionCollection: Collection = req.db.collection(TRANSACTIONS)
    let zoneCollection: Collection = req.db.collection(ZONES)

    let current = new Date()

    getOneToFailRes(res, zoneCollection, { _id: new ObjectID(body.id) }, null, (doc) => {
        let zone: Zone = doc
        let reserve = zone.bahias[body.bahia].reserva
        
        if (reserve.id == idReserve && validateExtend(zone, body.bahia, body.tiempo, req.app)) {

            calculateCost(zone, body.tiempo, current, req.app).then((costToken) => {
                let transaction: Transaction = {
                    fecha: current,
                    tipo: EXTEND_RESERVE,
                    usuario: { id: req.idSelf, tipo: AUX },
                    reserva: idReserve,
                    valor: costToken.cost
                }
                transactionCollection.insertOne(transaction)
                let time = body.tiempo + reserve.tiempo
                let cost = costToken.cost + reserve.costo

                let extension: Extension = {
                    fecha: current,
                    costo: costToken.description
                }

                reserveCollection.updateOne({ _id: idReserve }, {
                    $set: {
                        tiempoTotal: time,
                        costoTotal: cost
                    }, $push: { extensiones: extension }
                })

                zoneCollection.updateOne({ _id: new ObjectID(body.id) }, {
                    $set: {
                        [`bahias.${body.bahia}.reserva.tiempo`]: time
                        , [`bahias.${body.bahia}.reserva.costo`]: cost
                    }
                });
                res.send(new Response(true, body.bahia, `${reserve.id}`, costToken.cost, cost, current, false))
            }).catch(()=>{
                res.send(new Response(false, null, null, null, null, null, true))    
            })
        } else {
            res.send(new Response(false, null, null, null, null, null, true))
        }

    })
}