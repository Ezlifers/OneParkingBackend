import { saveCash } from '../../clients/util/cache-cash';
import { getOneToFailRes, updateToRes, ResponseSimple } from '../../../util/_index'
import { TRANSACTIONS } from '../../transactions/api'
import { Collection, ObjectID } from 'mongodb'
import { AUX } from '../../../config/constants'
import { Transaction, RECHARGE} from '../../transactions/models/_index'


interface RequestBody {
    celular: string;
    saldo: number;
}

export function recharge(req, res, next) {
    let body: RequestBody = req.body
    let transactionCollection: Collection = req.db.collection(TRANSACTIONS)

    getOneToFailRes(res, req.collection, { celular: req.celular }, null, (doc) => {
        let newCash = doc.saldo + body.saldo
        let lastTransaction = new Date();
        updateToRes(res, req.collection, { _id: doc._id }, { saldo: newCash, ultimaTransaccion: lastTransaction }, () => {
            
            let transaction: Transaction = {
                        fecha: lastTransaction,
                        tipo: RECHARGE,
                        usuario: { id: req.idSelf, tipo: AUX },
                        para:{id: doc._id, nombre: doc.nombre, celular: doc.celular,email: doc.email},
                        valor: body.saldo                        
                    }
            transactionCollection.insert(transaction);
            saveCash(req, doc._id, newCash, lastTransaction);
            return new ResponseSimple(true)
        }, () => {
            return new ResponseSimple(false)
        })
    })

}