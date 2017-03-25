import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoneService, Zone } from '../+shared/_index';
import { NavigationService } from '../../+core/_index';


declare var Materialize: any;
declare var $: any;

@Component({
    templateUrl: './zone-detail.component.html',
    styles: [`
    .sebm-google-map-container {
      height: 300px;
    }
  `]
})
export class ZoneDetailComponent implements OnInit {

    zone: Zone;
    desEditing = false;

    constructor(private router: Router, private service: ZoneService, private route: ActivatedRoute, private nav: NavigationService) { }

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        this.nav.loading = true;
        this.service.getZone(id).subscribe(data => this.initData(data, false), error => this.initData(null, true));
    }

    initData(data: Zone, err: boolean) {
        this.nav.loading = false;
        if (err) {
            Materialize.toast('Error al recuperar la zona', 4000);
            return;
        }
        this.zone = data;
        setTimeout(() => $('ul.tabs').tabs(), 40);
    }

}
