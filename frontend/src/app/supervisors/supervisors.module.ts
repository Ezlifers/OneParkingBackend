import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';

import { SupervisorService, SupervisorSelectedService } from './+shared/_index';
import { SupervisorListComponent } from './supervisor-list/supervisor-list.component';
import { SupervisorAddComponent } from './supervisor-add/supervisor-add.component';

import { SupervisorActivitiesComponent } from './supervisor-detail/activities/supervisor-activities.component';
import { SupervisorAssignComponent } from './supervisor-detail/assign/supervisor-assign.component';
import { SupervisorEditComponent } from './supervisor-detail/edit/supervisor-edit.component';
import { SupervisorSpecComponent } from './supervisor-detail/spec/supervisor-spec.component';
import { SupervisorAuxsComponent } from './supervisor-detail/auxs/supervisor-auxs.component';
import { SupervisorDescriptionComponent } from './supervisor-detail/supervisor-description.component';
import { SupervisorDetailComponent } from './supervisor-detail/supervisor-detail.component';

import { SupervisorsComponent } from './supervisors.component';

@NgModule({
    declarations: [
        SupervisorListComponent,
        SupervisorAddComponent,
        SupervisorActivitiesComponent,
        SupervisorAssignComponent,
        SupervisorEditComponent,
        SupervisorSpecComponent,
        SupervisorAuxsComponent,
        SupervisorDescriptionComponent,
        SupervisorDetailComponent,
        SupervisorsComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [SupervisorService, SupervisorSelectedService]
})
export class SupervisorsModule { }
