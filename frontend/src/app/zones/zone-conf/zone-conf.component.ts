import { Component, Input, OnInit } from '@angular/core';
import { Zone } from '../+shared/_index';
import { ConfigService } from '../../config/+shared/_index';
import { ZoneConfService } from './zone-conf.service';
import { Config as DefaultConfig } from '../../config/+shared/_index';

declare var Materialize: any;

@Component({
    selector: 'app-zone-conf',
    templateUrl: './zone-conf.component.html',
    providers: [ConfigService, ZoneConfService]

})
export class ZoneConfComponent implements OnInit {

    @Input() zone: Zone;
    loading = true;

    constructor(private configService: ConfigService, private zoneConf: ZoneConfService) { }

    ngOnInit() {
        this.loading = true;
        this.configService.getConfig()
            .subscribe(res => {this.defaultConfig(res, null)}, err => this.defaultConfig(null, err));
    }

    defaultConfig(config: DefaultConfig, err) {
        this.loading = false;
        if (err) {
            Materialize.toast('Error al traer la configuración por defecto', 4000);
            return;
        }
        this.zoneConf.config = config;
    }

}
