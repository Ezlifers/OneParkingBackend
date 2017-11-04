import { Response, Request } from 'express'
import { PERMISSIONS } from '../config/constants'

export class ResourcePermisions {

    permissions: any

    constructor(public resource: string) {
        this.permissions = {}
    }

    add(action: string, roles: string[]) {
        for (let role of roles) {
            if (this.permissions[role] == undefined)
                this.permissions[role] = {}
            this.permissions[role][action] = true
        }
    }
}

export function validatePermission(action: string) {
    return function (req, res: Response, next) {
        let resource = req.resourceName;
        let role = req.role
        let permissions = req.app.get(PERMISSIONS)
        let resourcePermissions = permissions[role][resource]

        if (resourcePermissions != undefined) {
            let actionPermission = resourcePermissions[action]
            if (actionPermission != undefined && actionPermission == true)
                next()
            else
                res.status(401).send({ msg: "Accion no permitida" })
        } else {
            res.status(401).send({ msg: "Accion no permitida" })
        }       
        
    }
}

