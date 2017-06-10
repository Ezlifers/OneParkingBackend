import { ObjectID, Collection } from 'mongodb'
import { AuxZone } from '../../users/models/_index'
import { ResponseSimple, pushToSimpleRes } from '../../../util/_index'

export function addZone(req, res, next) {
    let id = new ObjectID(req.params.id);
    let zone: AuxZone = req.body;
    let c = req.collection as Collection;
    c.updateOne({ _id: id, "zonas.id": zone.id }, { $push: { "zonas.$.horarios": zone.horarios[0] }, $inc: { version: 1 } }).then(result => {
        if (result.modifiedCount > 0) {
            res.send(new ResponseSimple(true));
        } else {
            pushToSimpleRes(res, req.collection, id, { zonas: zone }, { $inc: { version: 1 } });
        }
    }).catch(err => {
        res.send(new ResponseSimple(false));
    });
}