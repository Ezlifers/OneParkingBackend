import { cacheVersion } from '../../../util/cache-util';
import { CONFIG_DEFAULTS, CONFIG_ID, DATA_VERSION } from '../../../config/constants';
import { IConfig } from '../models/_index';
import { updateToSimpleRes } from '../../../util/response-util';
import { ObjectID } from 'mongodb';

export function update(req, res, next) {
    req.redis.get(CONFIG_ID, (err, id) => {

        cacheVersion(req, version => {
            let config = req.body as IConfig;
            config.version = version + 1;

            let filter = id ? { _id: new ObjectID(id) } : {};

            updateToSimpleRes(res, req.collection, filter, config, () => {
                req.redis.set(CONFIG_DEFAULTS, JSON.stringify(config));
                req.redis.set(DATA_VERSION, ""+config.version);
            });
        });

    });
}