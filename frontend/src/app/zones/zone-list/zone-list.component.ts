import { RESERVE } from '../+shared/io-global.service';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoneService, Zone, MapComponent, IOGlobalService, IOGlobal } from '../+shared/_index';
import { NavigationService } from '../../+core/_index';

declare var Materialize: any;

@Component({
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements AfterViewInit, OnDestroy {

  zones: Zone[] = [];
  indexs = {};
  ioConnection;

  constructor(private router: Router, private route: ActivatedRoute
    , private service: ZoneService, private nav: NavigationService, private io: IOGlobalService) { }

  ngAfterViewInit() {
    this.nav.loading = true;
    this.service.getZones().subscribe(data => this.loadZones(data, false), err => this.loadZones([], true));
  }

  ngOnDestroy() {
    if (this.ioConnection) {
      this.ioConnection.unsubscribe();
    }
  }

  loadZones(data: Zone[], error: boolean) {
    this.nav.loading = false;
    if (error) {
      Materialize.toast('Error al leer zonas', 4000);
      return;
    }
    let index = 0;
    for (const z of data) {
      this.indexs[z._id] = index;
      index++;
    }

    this.zones = data;
    this.ioConnection = this.io.connect().subscribe((globalData: IOGlobal) => {
      const i = this.indexs[globalData.id];
      if (globalData.dis) {
        const size = this.zones[i].estado.disOcupadas;
        this.zones[i].estado.disOcupadas = globalData.type === RESERVE ? size + 1 : size - 1;
      } else {
        const size = this.zones[i].estado.bahiasOcupadas;
        this.zones[i].estado.bahiasOcupadas = globalData.type === RESERVE ? size + 1 : size - 1;
      }
    });
  }

  goToAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  goToZone(id: number) {
    this.router.navigate(['./', id], { relativeTo: this.route });
  }

}
