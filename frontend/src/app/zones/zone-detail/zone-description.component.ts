import { Component, Input } from '@angular/core';
import { Zone } from '../+shared/_index';
import { ZoneSpecComponent } from './spec/zone-spec.component';
import { ZoneEditComponent } from './edit/zone-edit.component';

@Component({
    selector: 'app-zone-des',
    template: `
  <div class="section">
      <h5 class="detail-title">Descripcion
        <div class="right">
          <i *ngIf="editing" class="material-icons blue-text" (click)="cancel()">cancel</i>
          <i *ngIf="!editing" class="material-icons grey-text" (click)="edit()">mode_edit</i>
        </div>
      </h5>
      <app-zone-spec *ngIf="!editing" [zone]="zone"></app-zone-spec>
      <app-zone-edit *ngIf="editing" [zone]="zone" (finish)="cancel()"></app-zone-edit>
  </div>
  `
})
export class ZoneDescriptionComponent {

    @Input() zone: Zone;
    editing: boolean;

    edit() {
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

}
