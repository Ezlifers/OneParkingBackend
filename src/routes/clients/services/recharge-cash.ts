import { getOneToFailRes, updateToRes } from '../../../util/_index'
import { ObjectID } from 'mongodb'

//NO UTILIZAR SIN REGISTRAR TRANSACCION
interface RequestBody {
    saldo: number
}

class Response {
    constructor(private success: boolean, private saldo: number) { }
}

export function addCash(req, res, next) {

    let id = new ObjectID(req.params.id)
    let body:RequestBody =  req.body

    getOneToFailRes(res, req.collection, {_id: id}, null,(doc)=>{
        let newCash =  doc.saldo +  body.saldo
        updateToRes(res, req.collection, {_id:id}, {saldo: newCash},()=>{
            return new Response(true, newCash)
        }, ()=>{
            return new Response(false, null)
        })
    })

}