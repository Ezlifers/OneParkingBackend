import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Zone, Bay, ZoneService } from '../../+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-zone-edit',
    templateUrl: './zone-edit.component.html',
    styles: [`
    .sebm-google-map-container {
      height: 300px;
    }
  `]
})
export class ZoneEditComponent implements OnInit {
    @Input() zone: Zone;

    loading = false;
    loadingBays = false;
    nBays: number;

    centerLat: number;
    centerLon: number;

    name: string;
    cod: number;
    dir: string;
    lat: number;
    lon: number;

    @Output() finish = new EventEmitter<void>();

    constructor(private service: ZoneService) { }

    ngOnInit() {
        this.nBays = this.zone.bahias.length;
        this.centerLat = this.zone.localizacion.coordinates[1];
        this.centerLon = this.zone.localizacion.coordinates[0];

        this.name = this.zone.nombre;
        this.cod = this.zone.codigo;
        this.dir = this.zone.direccion;
        this.lat = this.zone.localizacion.coordinates[1];
        this.lon = this.zone.localizacion.coordinates[0];

    }

    mapClick(event: any) {
        this.lat = event.coords.lat;
        this.lon = event.coords.lng;
    }

    dragEnd(event: any) {
        this.lat = event.coords.lat;
        this.lon = event.coords.lng;
    }

    edit() {
        this.loading = true;
        this.service.update(this.zone._id, this.name, this.cod, this.dir, this.lat, this.lon).subscribe(
            res => this.edited(res),
            err => this.edited(false)
        );
    }

    edited(success: boolean) {
        this.loading = false;

        if (!success) {
            Materialize.toast('Error al editar zona', 4000);
            return;
        }

        this.zone.nombre = this.name;
        this.zone.codigo = this.cod;
        this.zone.direccion = this.dir;
        this.zone.localizacion.coordinates[1] = this.lat;
        this.zone.localizacion.coordinates[0] = this.lon;
        this.finish.emit(null);
        Materialize.toast('Zona actualizada', 4000);

    }

    editBays() {
        this.loadingBays = true;
        this.service.updateBays(this.zone._id, this.nBays).subscribe(
            res => this.editedBays(res),
            err => this.editedBays(false)
        );
    }

    editedBays(success: boolean) {
        if (!success) {
            Materialize.toast('Error al editar el numero de bahias', 4000);
            return;
        }

        this.service.getBays(this.zone._id).subscribe(res => this.successGetBays(res)
            , err => this.handleBaysError());
    }

    successGetBays(bays: Bay[]) {
        Materialize.toast('Numero de bahias actualizado', 4000);
        this.loadingBays = false;
        this.zone.bahias = bays;
        this.finish.emit(null);
    }

    handleBaysError() {
        this.loadingBays = false;
        Materialize.toast('Error al traer las nuevas bahias', 4000);
        this.finish.emit(null);
    }

}
