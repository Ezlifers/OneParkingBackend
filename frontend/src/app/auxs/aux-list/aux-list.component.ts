import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuxService, Aux, AuxSelectedService } from '../+shared/_index';
import { NavigationService } from '../../+core/_index';


declare var Materialize: any;

@Component({
  templateUrl: './aux-list.component.html'
})
export class AuxListComponent implements AfterViewInit {

  auxs: Aux[] = [];

  constructor(private router: Router
    , private route: ActivatedRoute
    , private nav: NavigationService
    , private service: AuxService
    , private selected: AuxSelectedService) { }

  ngAfterViewInit() {
    this.nav.loading = true;
    this.service.getAuxs(true).subscribe(data => this.loadAuxs(data, false), error => this.loadAuxs(null, true));
  }

  loadAuxs(data: Aux[], err: boolean) {
    this.nav.loading = false;
    if (err) {
      Materialize.toast('Error al leer auxiliares', 4000);
      return;
    }
    this.auxs = data;
  }

  goToAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  goToAux(aux: Aux) {
    this.selected.aux = aux;
    this.router.navigate(['./' + aux._id], { relativeTo: this.route });
  }

}
