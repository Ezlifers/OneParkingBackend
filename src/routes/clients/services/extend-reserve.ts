import { saveCash } from '../util/cache-cash';
import { cacheConfig } from '../../../util/cache-util';
import { ZONES } from '../../zones/api'
import { RESERVES } from '../../reserves/api'
import { TRANSACTIONS } from '../../transactions/api'
import { Zone } from '../../zones/models/_index'
import { Transaction, EXTEND_RESERVE } from '../../transactions/models/_index'
import { Extension } from '../../reserves/models/_index'
import { getOneToFailRes, validateExtend, calculateCost, reserveExtended } from '../../../util/_index'
import { CLIENT } from '../../../config/constants'
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
        private residue: number,
        private date: Date,
        private noAvaibility: boolean,
        private noMoney: boolean
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
        cacheConfig(req, config => {

            if (reserve.id == req.params.id && validateExtend(zone, body.bahia, body.tiempo, config)) {
                calculateCost(zone, body.tiempo, current, config, reserve.tiempo).then((costToken) => {

                    getOneToFailRes(res, req.collection, { _id: req.idSelf }, null, (doc) => {
                        let cash = doc.saldo
                        let cost = costToken.cost - reserve.costo
                        let timeTotal = costToken.time + reserve.tiempo

                        if (cash < cost) {
                            res.send(new Response(false, null, null, null, null, null, null, false, true))
                        } else {

                            let remainingCash = cash - cost
                            let transaction: Transaction = {
                                fecha: current,
                                tipo: EXTEND_RESERVE,
                                usuario: { id: req.idSelf, tipo: CLIENT, saldoRestante: remainingCash },
                                reserva: idReserve,
                                valor: cost
                            }
                            transactionCollection.insertOne(transaction)

                            let extension: Extension = {
                                fecha: current,
                                tiempo: costToken.time,
                                valor: cost
                            }

                            reserveCollection.updateOne({ _id: idReserve }, {
                                $set: {
                                    tiempoTotal: timeTotal,
                                    costoTotal: costToken.cost
                                }, $push: { extensiones: extension }
                            })

                            zoneCollection.updateOne({ _id: new ObjectID(body.id) }, {
                                $set: {
                                    [`bahias.${body.bahia}.reserva.tiempo`]: timeTotal
                                    , [`bahias.${body.bahia}.reserva.costo`]: costToken.cost
                                }
                            });

                            req.collection.updateOne({ _id: req.idSelf }, { $set: { saldo: remainingCash, ultimaTransaccion: current } })
                            saveCash(req, req.idSelf, remainingCash, current);
                            reserveExtended(body.id, body.bahia, timeTotal * 1000, reserve.fecha, zone.bahias[body.bahia].dis);
                            res.send(new Response(true, body.bahia, `${reserve.id}`, cost, costToken.cost, remainingCash, current, false, false))
                        }
                    })
                }, () => {
                    res.send(new Response(false, null, null, null, null, null, null, false, true))
                })
            } else {
                res.send(new Response(false, null, null, null, null, null, null, true, false))
            }
        });
    });
}