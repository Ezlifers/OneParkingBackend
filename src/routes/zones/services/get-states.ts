import { getListToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { setUpZone, QueryZone } from '../util/zone-util'

class QueryStates{
    lat:number;
    lon:number;
    prevLat:number;
    prevLon:number;
    prev:boolean;
    
    constructor(query:any){
        this.lat = query.lat ? parseFloat(query.lat) : null;
        this.lon = query.lon ? parseFloat(query.lon) : null;
        this.prevLat = query.prevLat ? parseFloat(query.prevLat) : null;
        this.prevLon = query.prevLon ? parseFloat(query.prevLon) : null;
        this.prev = this.prevLat !=null  && this.prevLon != null
    }
}

export function getList(req, res, next){
    let query =  new QueryZone(req.query)
    getListToFailRes(res, req.collection, query, (docs)=>{
        setUpZone(req.app, new Date(), query, docs).then(()=>{
            res.send(docs)
        })
    })
}