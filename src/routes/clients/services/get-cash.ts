import { cacheCash } from '../util/cache-cash';
import { ResponseSimple } from '../../../util/_index'
import { ObjectID } from 'mongodb'

class Response {
    constructor(private saldo: number, private ultimaTransaccion:Date) { }
}

export function getCash(req, res, next) {

    let id = new ObjectID(req.params.id)
    cacheCash(req, req.params.id, (err, cash, transaction)=>{
        if(err){
            res.status(404).send(new ResponseSimple(false));
        }else{
            res.send(new Response(cash, transaction));
        }
    });
}