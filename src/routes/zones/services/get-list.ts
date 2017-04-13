import { getListToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { setUpZone, QueryZone } from '../util/zone-util'


export function getList(req, res, next){
    let query =  new QueryZone(req.query)
    getListToFailRes(res, req.collection, query, (docs)=>{
        setUpZone(req.app, new Date(), query, docs).then(()=>{
            res.send(docs)
        })
    })
}