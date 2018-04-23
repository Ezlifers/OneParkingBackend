import { Component, OnInit } from '@angular/core';
import { Config, ConfigService } from './+shared/_index';
import { NavigationService } from '../+core/_index';

declare var Materialize: any;

@Component({
    template: `
        <div class="card-panel row" *ngIf="config">
            <div class="section">
                <h4 class="detail-title">Basico
                    <div class="right">
                    <i *ngIf="editing" class="material-icons blue-text" (click)="cancel()">cancel</i>
                    <i *ngIf="!editing" class="material-icons grey-text" (click)="edit()">mode_edit</i>
                    </div>
                </h4>
                <div>
                    <app-config-spec *ngIf="!editing" [config]="config"></app-config-spec>
                    <app-config-edit *ngIf="editing" [config]="config" (finish)="cancel()"></app-config-edit>
                </div>
            </div>
        </div>
    `
})
export class ConfigComponent implements OnInit {

    editing: boolean;
    config: Config;

    constructor(private service: ConfigService, private nav: NavigationService) { }

    ngOnInit() {
        this.nav.loading = true;
        this.nav.title = 'Configuración';
        this.service.getConfig().subscribe(
            res => {
                this.nav.loading = false;
                this.config = res;
            },
            err => {
                this.nav.loading = false;
                Materialize.toast('Error al cargar la coniguración', 4000);
            }
        );
    }

    edit() {
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

}
