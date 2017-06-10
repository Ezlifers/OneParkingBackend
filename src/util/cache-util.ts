import { ZONES } from '../routes/zones/api';
import { CONFIG } from '../routes/config/api';
import { CONFIG_DEFAULTS, DATA_VERSION } from '../config/constants';
import { IConfig } from '../routes/config/models/_index';


export function cacheConfig(req: any,  callback: (IConfig) => void) {
    req.redis.get(CONFIG_DEFAULTS, (err, result) => {
        if (result) {
            callback(JSON.parse(result));
        } else {
            req.db.collection(CONFIG).findOne({}).then((r) => {
                req.redis.set(CONFIG_DEFAULTS, JSON.stringify(r));
                callback(r);
            });
        }
    });
}

export function cacheVersion(req: any, callback: (number) => void) {
    req.redis.get(DATA_VERSION, (err, result) => {
        if (result) {
            callback(parseInt(result));
        } else {
            req.db.collection(CONFIG).findOne({}).then((r) => {
                req.db.collection(ZONES).findOne({ $query: {}, $orderby: { version: -1 } }).then(zone => {
                    let version = r.version;
                    if (zone != null) {
                        version = version >= zone.version ? version : zone.version;
                    }
                    req.redis.set(DATA_VERSION, "" + version);
                    callback(version);
                })

            });
        }
    });
}