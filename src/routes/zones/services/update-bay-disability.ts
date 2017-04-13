import { ObjectID } from 'mongodb'
import { updateToSimpleRes } from '../../../util/response-util'

interface RequestBody {
    pos: number
    dis: boolean

}

export function updateBayDisability(req, res, next) {
    let id = new ObjectID(req.params.id)
    let body: RequestBody = req.body

    updateToSimpleRes(res, req.collection, { _id: id }, { [`bahias.${body.pos}.dis`]: body.dis })
}

