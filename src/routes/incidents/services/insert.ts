import { Incident } from '../models/_index'
import { saveIncidentImage } from "../../../util/img-util"
import { insertToRes } from "../../../util/response-util"

class Response {
    constructor(private success: boolean
        , private id: string
        , private failImage: boolean) { }
}

export function insert(req, res, next) {
    let incident = req.body as Incident

    incident.atendida = false
    incident.fecha =  new Date()
    incident.usuario.id = req.idSelf
    incident.usuario.tipo = req.role

    saveIncidentImage(incident.foto, (path)=>{
        incident.foto = path
        insertIncident(res, req.collection, incident)
    }, (defaultImg)=>{
        incident.foto = defaultImg
        insertIncident(res, req.collection, incident)
    }, ()=>{
        res.send(new Response(false, null, true))
    })

}

function insertIncident(res, collection, incident) {

    insertToRes(res, collection, incident, (id) => {
        return new Response(true, `${id}`, false)
    }, () => {
        return new Response(false, null, false)
    })

}
