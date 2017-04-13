import { ObjectID } from 'mongodb'

class Query {
    days: number[]
    constructor(query: any) {
        let daysString: string[] = query.days ? query.days.split(",") : null
        if (daysString)
            this.days = daysString.map(Number)
    }
}

export function getZones(req, res, next) {

    let id = new ObjectID(req.params.id)
    let query = new Query(req.query)

    let pipelines: any[] = [
        { $match: { _id: id } }
        , { $project: { zonas: 1 } }
        , { $unwind: "$zonas" }
        ,{ $unwind:"$zonas.horarios"}
    ]

    if (query.days)
        pipelines.push({ $match: { "zonas.horarios.dias": { $in: query.days } } })

    pipelines.push({ $sort: { "zonas.horarios.dias": 1, "zonas.horarios.ti": 1 } });
    pipelines.push({ $group: { _id: "$_id", zonas: { $push: "$zonas" } } });

    req.collection.aggregate(pipelines).toArray().then((docs)=>{
        res.send(docs[0].zonas)
    }, (err)=>{
        res.send([])
    })

}