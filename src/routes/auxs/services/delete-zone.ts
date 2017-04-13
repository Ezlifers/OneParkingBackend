import { ObjectID } from 'mongodb';
import { ResponseSimple } from '../../../util/_index';

interface RequestBody {
    id: string;
}

export function deleteZone(req, res, next) {

    let id = new ObjectID(req.params.id);
    let body: RequestBody = req.body;

    req.collection.updateOne({ _id: id }, { $pull: { zonas: { id: body.id } } }).then(result => {
        res.send(new ResponseSimple(true));
    }).catch(err => {
        res.send(new ResponseSimple(false));
    });

}