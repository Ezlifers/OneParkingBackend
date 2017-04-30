import { ZONES } from '../../zones/api'
import { RESERVES } from '../../reserves/api'
import { TRANSACTIONS } from '../../transactions/api'
import { Reserve as ZoneReserve } from '../../zones/models/_index'
import { Transaction, RESERVE } from '../../transactions/models/_index'
import { Reserve } from '../../reserves/models/_index'
import { getOneToFailRes, insertToRes, validateAvailability, calculateCost } from '../../../util/_index'
import { AUX } from '../../../config/constants'
import { Collection, ObjectID } from 'mongodb'


//TODO: cambiar idZone y codigoZona por zona
interface RequestBody {
    id: string // Zone
    codigo: number
    fecha: Date
    celular?: string
    placa: string
    tiempo: number // Sec
    discapacidad: boolean
}

class Response {
    constructor(private success: boolean,
        private bay: number,
        private reservation: string,
        private cost: number,
        private date: Date,
        private noAvaibility: boolean
    ) { }
}

export function reserve(req, res, next) {

    let reserveCollection: Collection = req.db.collection(RESERVES)
    let transactionCollection: Collection = req.db.collection(TRANSACTIONS)
    let zoneCollection: Collection = req.db.collection(ZONES)

    let body: RequestBody = req.body
    body.fecha = new Date(body.fecha)
    let idZone = new ObjectID(body.id)
    //TODO: probar la fecha si es necesario comvertir de string a date

    getOneToFailRes(res, zoneCollection, { _id: idZone }, null, (doc) => {
        validateAvailability(doc, body.fecha, body.discapacidad).then((availableToken) => {
            calculateCost(doc, body.tiempo, body.fecha, req.app).then((costToken) => {
                let reserve: Reserve = {
                    fecha: body.fecha,
                    zona: {
                        id: new ObjectID(body.id),
                        codigo: body.codigo,
                        bahia: availableToken.bay
                    },
                    usuario: {
                        id: req.idSelf,
                        tipo: AUX
                    },
                    vehiculo: {
                        placa: body.placa
                    },
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
                        usuario: { id: req.idSelf, tipo: AUX },
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
                        usuario: { id: req.idSelf, tipo: AUX },
                        vehiculo: { placa: body.placa },
                        suspendida: false
                    }
                    zoneCollection.updateOne({ _id: new ObjectID(doc._id) }, {
                        $set: { [`bahias.${availableToken.bay}.reserva`]: zoneReserve }
                    })

                    res.send(new Response(true, availableToken.bay, `${result.insertedId}`, reserve.costoTotal, body.fecha, false))

                }, (err) => {
                    res.send(new Response(false, null, null, null, null, false))
                })
            }, () => {
                res.send(new Response(false, null, null, null, null, true))
            })
        }).catch((err)=>{
            res.send(new Response(false, null, null, null, null, true))
        })
    })
}