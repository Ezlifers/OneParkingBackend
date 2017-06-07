import { cacheConfig } from '../../../util/cache-util';
import { getOneToFailRes } from '../../../util/response-util'
import { IConfig } from '../models/_index';
import { ObjectID } from 'mongodb';

export function get(req, res, next) {
    cacheConfig(req, config=>{
        res.send(config);
    });
}