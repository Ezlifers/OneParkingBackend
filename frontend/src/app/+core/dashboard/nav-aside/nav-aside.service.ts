import { Injectable } from '@angular/core';

@Injectable()
export class NavAsideService {

    menuAdmin: IMenu[] = [
         { label: 'Movimientos', icon: 'attach_money', path: 'movimientos' },
        { label: 'Incidencias', icon: 'warning', path: 'incidencias' },
        { label: 'Zonas', icon: 'room', path: 'zonas' },
        { label: 'Auxiliares', icon: 'person_pin', path: 'auxiliares' },
        { label: 'Supervisores', icon: 'supervisor_account', path: 'supervisores' },
        { label: 'Configuración', icon: 'settings', path: 'configuracion' }
    ];

    menuProfile: IMenu[] = [
        { label: 'Modificar Perfil', icon: 'perm_identity', path: 'perfil' }
    ];

    logout: IMenu = { label: 'Cerrar Sesión', icon: 'power_settings_new' };

}

interface IMenu {
    label: string;
    icon: string;
    path?: string;
}
