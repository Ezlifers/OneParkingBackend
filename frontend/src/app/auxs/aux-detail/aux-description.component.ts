import { Component, Input } from '@angular/core';
import { Aux } from '../+shared/_index';

@Component({
    selector: 'app-aux-des',
    template: `
  <div class="section">
      <h5 class="detail-title">Descripcion
        <div class="right">
          <i *ngIf="editing" class="material-icons blue-text" (click)="cancel()">cancel</i>
          <i *ngIf="!editing" class="material-icons grey-text" (click)="edit()">mode_edit</i>
        </div>
      </h5>
      <app-aux-spec *ngIf="!editing" ></app-aux-spec>
      <app-aux-edit *ngIf="editing" (finish)="cancel()"></app-aux-edit>
  </div>
  `
})

export class AuxDescriptionComponent {

    editing: boolean;

    edit() {
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

}
