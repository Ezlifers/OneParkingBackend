import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Config, ConfigService } from '../+shared/_index';

declare var Materialize: any;
declare var $: any;

@Component({
    selector: 'app-config-edit',
    templateUrl: './config-edit.component.html'
})
export class ConfigEditComponent implements OnInit {

    @Output() finish = new EventEmitter<void>();
    @Input() config: Config;

    loading: boolean;
    newConfig: Config;
    prices: string;
    scheduleDeleted: boolean;

    constructor(private service: ConfigService) { }

    ngOnInit() {
        $('.modal').modal();
        this.newConfig = {
            tiempoMin: this.config.tiempoMin / 60,
            tiempoMax: this.config.tiempoMax / 60,
            precio: [],
            vehiculosUsuario: this.config.vehiculosUsuario,
            tiempos: JSON.parse(JSON.stringify(this.config.tiempos))
        };
        this.prices = this.config.precio.join(', ');
    }

    scheduleDelete(deleted: boolean) {
        this.scheduleDeleted = deleted;
    }

    edit() {
        const newPrices = this.prices.replace(/\s/g, '').split(',');

        if (this.newConfig.tiempoMin <= 0 || this.newConfig.tiempoMax <= 0) {
            Materialize.toast('El tiempo maximo o minimo no pueden ser menores o iguales a cero', 4000);
            return;
        } else if (this.newConfig.tiempoMax % this.newConfig.tiempoMin !== 0) {
            Materialize.toast('El tiempo maximo debe ser multiplo del tiempo minimo', 4000);
            return;
        } else if (newPrices.length !== (this.newConfig.tiempoMax / this.newConfig.tiempoMin)) {
            Materialize.toast('La cantidad de precios = Tiempo Maximo / Tiempo Minimo', 4000);
            return;
        }

        this.newConfig.precio = newPrices.map(Number);
        if (this.scheduleDeleted) {
            $('#changeAllSchedule').modal('open');
        } else {
            this.loading = true;
            this.service.editConfig(this.newConfig)
                .subscribe(
                res => this.edited(res),
                error => this.edited(false)
                );
        }
    }

    deleteAuxs() {
        this.loading = true;
        this.service.resetAuxs().subscribe(resAuxs => {
            if (resAuxs) {
                this.service.editConfig(this.newConfig)
                    .subscribe(
                    res => this.edited(res),
                    error => this.edited(false)
                    );
            } else {
                Materialize.toast('Error al editar las configuraciones', 4000);
            }
        }, err => {
            Materialize.toast('Error al editar las configuraciones', 4000);
        });
    }

    edited(success: boolean) {
        this.loading = false;
        if (!success) {
            Materialize.toast('Error al editar las configuraciones', 4000);
            return;
        }
        this.config.tiempoMin = this.newConfig.tiempoMin;
        this.config.tiempoMax = this.newConfig.tiempoMax;
        this.config.tiempos = this.newConfig.tiempos;
        this.config.precio = this.newConfig.precio;
        this.config.vehiculosUsuario = this.newConfig.vehiculosUsuario;
        Materialize.toast('Configuraciones actualizadas', 4000);
        this.finish.emit(null);
    }


}
