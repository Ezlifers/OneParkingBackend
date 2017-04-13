import { getOneToFailRes } from '../../../util/response-util'
import { CONFIG_ID } from '../../../config/constants'
import { IConfig } from '../models/_index';
import { ObjectID } from 'mongodb';

export function get(req, res, next) {
    const id = new ObjectID(req.app.get(CONFIG_ID));
    getOneToFailRes(res, req.collection, { _id: id }, {}, (config: IConfig) => {
        for (let time of config.tiempos) {
            for (let shedule of time.horarios) {
                shedule.p = shedule.dp ? config.precio : shedule.p;
            }
        }
        res.send(config);
    });
}