import { ZONES } from '../../zones/api'
import { RESERVES } from '../../reserves/api'
import { TRANSACTIONS } from '../../transactions/api'
import { Car } from '../../users/models/_index'
import { Reserve as ZoneReserve } from '../../zones/models/_index'
import { Transaction, RESERVE } from '../../transactions/models/_index'
import { Reserve } from '../../reserves/models/_index'
import { getOneToFailRes, insertToRes, validateAvailability, calculateCost, reserveAdded } from '../../../util/_index'
import { CLIENT } from '../../../config/constants'
import { Collection, ObjectID } from 'mongodb'

interface RequestBody {
    id: string // Zone
    codigo: number
    fecha: Date
    celular: string
    tiempo: number // Sec
    discapacidad: boolean
    vehiculo: Car
}

class Response {
    constructor(private success: boolean,
        private bay: number,
        private reservation: string,
        private cost: number,
        private residue: number,
        private date: Date,
        private noAvaibility: boolean,
        private noMoney: boolean
    ) { }
}

export function reserve(req, res, next) {

    let reserveCollection: Collection = req.db.collection(RESERVES)
    let transactionCollection: Collection = req.db.collection(TRANSACTIONS)
    let zoneCollection: Collection = req.db.collection(ZONES)

    let body: RequestBody = req.body
    body.fecha = new Date(body.fecha)
    let idZone = new ObjectID(body.id)

    getOneToFailRes(res, zoneCollection, { _id: idZone }, null, (doc) => {

        validateAvailability(doc, body.fecha, body.discapacidad).then((availableToken) => {
            calculateCost(doc, body.tiempo, body.fecha, req.app).then((costToken) => {

                getOneToFailRes(res, req.collection, { _id: req.idSelf }, null, (doc) => {

                    let cash = doc.saldo
                    if (cash < costToken.cost) {
                        res.send(new Response(false, null, null, null, null, null, false, true))
                    } else {
                        let remainingCash = cash - costToken.cost
                        let reserve: Reserve = {
                            fecha: body.fecha,
                            zona: {
                                id: idZone,
                                codigo: body.codigo,
                                bahia: availableToken.bay
                            },
                            usuario: {
                                id: req.idSelf,
                                celular: body.celular,
                                tipo: CLIENT
                            },
                            vehiculo: body.vehiculo,
                            discapacidad: body.discapacidad,
                            tiempoMin: costToken.minTime,
                            tiempoTotal: costToken.time,
                            costoTotal: costToken.cost,
                            costoInicial: costToken.description,
                            extensiones: [],
                            suspendida: false
                        }

                        reserveCollection.insertOne(reserve).then((result) => {
                            let transaction: Transaction = {
                                fecha: body.fecha,
                                usuario: { id: req.idSelf, tipo: CLIENT, saldoRestante:remainingCash },
                                tipo: RESERVE,
                                valor: reserve.costoTotal,
                                reserva: result.insertedId
                            }

                            transactionCollection.insertOne(transaction)
                            let zoneReserve: ZoneReserve = {
                                id: result.insertedId,
                                fecha: body.fecha,
                                costo: reserve.costoTotal,
                                tiempo: reserve.tiempoTotal,
                                usuario: { id: req.idSelf, tipo: CLIENT, celular: body.celular },
                                vehiculo: body.vehiculo,
                                suspendida: false
                            }
                            zoneCollection.updateOne({ _id: new ObjectID(doc._id) }, {
                                $set: { [`bahias.${availableToken.bay}.reserva`]: zoneReserve }
                            })
                            reserveAdded(body.id, availableToken.bay, body.tiempo * 1000);
                            res.send(new Response(true, availableToken.bay, `${result.insertedId}`, reserve.costoTotal,remainingCash, body.fecha, false, false))

                        }, (err) => {
                            res.send(new Response(false, null, null, null, null,null, false, false))
                        })
                    }
                })

            }, () => {
                res.send(new Response(false, null, null, null, null, null, true, false))
            })
        }, () => {
            res.send(new Response(false, null, null, null, null, null, true, false))
        })

    })

}
