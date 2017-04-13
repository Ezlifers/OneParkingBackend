import { ObjectID } from 'mongodb';
import { ResponseSimple } from '../../../util/_index';

interface RequestBody{
    dias:number[];
    id:string;
    ti:number;
    tf:number;
}

export function deleteSchedule(req, res, next){

    let id =  new ObjectID(req.params.id);
    let body:RequestBody = req.body;

    req.collection.updateOne({_id:id, "zonas.id":body.id},{$pull:{"zonas.$.horarios":{dias: body.dias, ti:body.ti, tf: body.tf}}}).then(result=>{
        res.send(new ResponseSimple(true));
    }).catch(err=>{
        res.send(new ResponseSimple(false));
    });

}