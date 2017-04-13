import { getListToSimpleRes, Query } from '../../../util/response-util'
import { toUTC } from '../../../util/date-util'

class QueryIncident extends Query {
    from: Date //YYYY-MM-DD
    to: Date //YYYY-MM-DD
    all: boolean // Optional

    constructor(query: any) {
        super(query)

        this.from = query.from ? toUTC(query.from) : null
        if (this.from) {
            this.to = query.to ? toUTC(query.to + "T23:59:59") : toUTC(query.from + "T23:59:59")
            this.q.fecha = {$gte:this.from, $lte:this.to}
        }

        this.all = query.all ? query.all == 'true' : false
        if(!this.all){
            this.q.atendida = false
        }

    }
}

export function getList(req, res, next){
    let query =  new QueryIncident(req.query)
    getListToSimpleRes(res, req.collection, query)
}