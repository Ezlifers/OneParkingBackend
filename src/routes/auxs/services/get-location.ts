import { ObjectID } from 'mongodb'
import { getListToSimpleRes, Query } from '../../../util/_index'
import { toUTC } from '../../../util/date-util'

class QueryLocation extends Query {
    from: Date //YYYY-MM-DDThh:mm:ss
    to: Date //YYYY-MM-DDThh:mm:ss
    
    constructor(query: any) {
        super(query)
        this.from = query.from ? toUTC(query.from) : null
        if (this.from) {
            this.to = query.to ? toUTC(query.to) : toUTC(query.from + "T23:59:59")
            this.q.fecha = {$gte:this.from, $lte:this.to}
        }
    }
}

export function getLocation(req, res, next){
    
    let id = new ObjectID(req.params.id)
    let locationCollection =  req.db.collection("auxiliares_loc")
    let query =  new QueryLocation(req.query)
    query.q.aux = id
    getListToSimpleRes(res, locationCollection, query)

}