import { ObjectID } from 'mongodb'
import { getListToSimpleRes, Query } from '../../../util/_index'
import { toUTC } from '../../../util/date-util'

class QueryTransaction extends Query {
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

export function getList(req, res, next){
    let query =  new QueryTransaction(req.query)
    getListToSimpleRes(res, req.collection, query)
}