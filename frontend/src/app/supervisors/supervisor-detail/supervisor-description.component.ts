import { Component, Input } from '@angular/core';
import { SupervisorSpecComponent } from './spec/supervisor-spec.component';
import { SupervisorEditComponent } from './edit/supervisor-edit.component';

@Component({
    selector: 'app-supervisor-des',
    template: `
  <div class="section">
      <h5 class="detail-title">Descripcion
        <div class="right">
          <i *ngIf="editing" class="material-icons blue-text" (click)="cancel()">cancel</i>
          <i *ngIf="!editing" class="material-icons grey-text" (click)="edit()">mode_edit</i>
        </div>
      </h5>
      <app-supervisor-spec *ngIf="!editing" ></app-supervisor-spec>
      <app-supervisor-edit *ngIf="editing" (finish)="cancel()"></app-supervisor-edit>
  </div>
  `
})

export class SupervisorDescriptionComponent {

    editing: boolean;

    edit() {
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

}
