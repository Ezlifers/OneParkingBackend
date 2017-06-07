import { DATA_VERSION } from '../../../config/constants';
import { cacheVersion } from '../../../util/cache-util';
import { ObjectID } from 'mongodb';
import { updateToSimpleRes } from '../../../util/response-util';

interface RequestBody {
    pos: number;
    dis: boolean;
}

export function updateBayDisability(req, res, next) {
    let id = new ObjectID(req.params.id);
    let body: RequestBody = req.body;
    cacheVersion(req, version => {
        const newVersion = version + 1;        
        updateToSimpleRes(res, req.collection, { _id: id }, { version: newVersion, [`bahias.${body.pos}.dis`]: body.dis }, ()=>{
            req.redis.set(DATA_VERSION, "" + newVersion);
        });
    });


}

