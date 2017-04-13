import { getOneToRes } from "../../../util/response-util"
import { Supervisor } from '../../users/models/_index'
import { ObjectID } from 'mongodb'

export function getAuxList(req, res, next) {
    let id = new ObjectID(req.params.id)

    getOneToRes(res, req.collection, {_id:id}, {}, (doc)=>{
        let supervisor = doc as Supervisor
        return supervisor.auxiliares
    })
}