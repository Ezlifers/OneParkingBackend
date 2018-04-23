import { Component, Input } from '@angular/core';
import { User } from '../+core/_index';

@Component({
    template: `
        <div class="card-panel row">
            <div class="section">
                <h5 class="detail-title">Perfil
                    <div class="right">
                    <i *ngIf="editing" class="material-icons blue-text" (click)="cancel()">cancel</i>
                    <i *ngIf="!editing" class="material-icons grey-text" (click)="edit()">mode_edit</i>
                    </div>
                </h5>
                <app-profile-spec *ngIf="!editing" ></app-profile-spec>
                <app-profile-edit *ngIf="editing" (finish)="cancel()"></app-profile-edit>
            </div>
        </div>
    `
})

export class ProfileComponent {

    editing: boolean;

    edit() {
        this.editing = true;
    }

    cancel() {
        this.editing = false;
    }

}
