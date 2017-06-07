import { getListToFailRes } from '../../../util/response-util';
import { Zone } from '../models/_index';
import { QueryStates, setUpStates } from '../util/state-util';

export function getStates(req, res, next) {
    let query =  new QueryStates(req.query)
    getListToFailRes(res, req.collection, query, (docs)=>{
        setUpStates(req, new Date(), query, docs).then(()=>{
            res.send(docs);
        });
    });
}