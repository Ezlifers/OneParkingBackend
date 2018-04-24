import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoneService, ZoneBase } from '../+shared/_index';

declare var Materialize: any;

@Component({
    templateUrl: './zone-add.component.html',
    styles: [`
    .sebm-google-map-container {
      height: 300px;
    }
  `]
})
export class ZoneAddComponent {

    zone: ZoneBase;
    loading = false;

    centerLat = 2.4418772715077126;
    centerLon = -76.60630663485716;

    constructor(private router: Router, private route: ActivatedRoute, private service: ZoneService) {
        this.zone = {
            codigo: null, direccion: '', localizacion: { type: 'Point', coordinates: [this.centerLon, this.centerLat] }
            , nBahias: null, nombre: ''
        };
    }

    add() {
        this.loading = true;
        this.service.insertZone(this.zone).subscribe(
            res => this.added(res),
            error => this.added([false, null, false])
        );
    }

    added(res: [boolean, string, boolean]) {

        const [success, id, outRange] = res;
        this.loading = false;

        if (success) {
            Materialize.toast('Operación Exitosa', 4000)
            this.router.navigate(['../'], { relativeTo: this.route });
        } else if (outRange) {
            Materialize.toast('Zona fuera de rango', 4000)
        } else {
            Materialize.toast('Error al ingresar Zona', 4000)
        }

    }

    mapClick(event: any) {
        this.zone.localizacion.coordinates[1] = event.coords.lat;
        this.zone.localizacion.coordinates[0] = event.coords.lng;
    }

    dragEnd(event: any) {
        this.zone.localizacion.coordinates[1] = event.coords.lat;
        this.zone.localizacion.coordinates[0] = event.coords.lng;

    }

}


