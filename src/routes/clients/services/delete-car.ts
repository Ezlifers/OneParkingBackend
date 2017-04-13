import { pullToSimpleRes } from '../../../util/_index'

export function deleteCar(req, res, next){
    let plate = req.params.placa
    pullToSimpleRes(res, req.collection, req.idSelf, {vehiculos:{placa:plate}})

}