import { getListToFailRes } from '../../../util/response-util'
import { Zone } from '../models/_index'
import { defaultTimesActive, QueryStates, setUpStates } from '../util/state-util'
import { Application } from "express";

export function getList(req, res, next) {
    let query =  new QueryStates(req.query, req.app)
    getListToFailRes(res, req.collection, query, (docs)=>{
        setUpStates(new Date(), query, docs).then(()=>{
            res.send(docs)
        })
    })
}