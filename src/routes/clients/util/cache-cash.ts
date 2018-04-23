import { USERS } from '../../users/api';
import { RedisClient } from 'redis';
import { ObjectID } from "mongodb";

export class SavedCash{
    cash:number;
    transaction:Date;
}

export function saveCash(req: any, id:string, cash:number, transaction:Date){
    let redis: RedisClient = req.redis;
    let save:SavedCash = {cash:cash, transaction: transaction};
    redis.set(`CLIENTE:${id}`, JSON.stringify(save)); 
}

export function cacheCash(req: any, id: string, callback: (err:any, cash: number, transaction:Date) => void) {
    let redis: RedisClient = req.redis;
    redis.get(`CLIENTE:${id}`, (err, result) => {
        if (result) {
            let saved:SavedCash = JSON.parse(result);
            callback(null, saved.cash, saved.transaction);
        } else {
            let idO = new ObjectID(id);
            req.collection(USERS).findOne({ _id: idO }, {saldo:1}).then((doc)=>{
                if(doc){
                    let save:SavedCash = {cash:doc.saldo, transaction: doc.ultimoMovimiento};
                    redis.set(`CLIENTE:${id}`, JSON.stringify(save));
                    callback(null, doc.saldo, doc.ultimoMovimiento);
                }else{
                    callback(true, null, null);
                }
            }, (err)=>{
                callback(true, null, null);
            });
        }
    });

}