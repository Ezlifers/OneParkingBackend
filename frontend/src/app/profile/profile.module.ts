import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';

import { ProfileService } from './+shared/profile.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileSpecComponent } from './profile-spec/profile-spec.component';
import { ProfileComponent } from './profile.component';

@NgModule({
    declarations: [
        ProfileEditComponent,
        ProfileSpecComponent,
        ProfileComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [ProfileService]
})
export class ProfileModule { }
