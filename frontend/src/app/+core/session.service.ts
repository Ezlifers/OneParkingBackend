import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    public user: User;
    public type: string;
    public token: string;
    public logged: boolean;
    public id: string;
    public permission: any;

    reset() {
        this.user = null;
        this.type = '';
        this.token = '';
        this.logged = false;
        this.id = '';
    }
}

export interface User {
    _id: string;
    tipo: string;
    nombre: string;
    cedula: string;
    celular: string;
    imagen: string;
}

/*export interface Permission {
    usuarios: PermissionAction;

    configuracion: PermissionAction;

}

export interface PermissionAction {
    get?: boolean;
    getSelf?: boolean;
    getList?: boolean;
    insert?: boolean;
    update?: boolean;
    delete?: boolean;
    resetPass?: boolean;
    updatePass?: boolean;
}*/

