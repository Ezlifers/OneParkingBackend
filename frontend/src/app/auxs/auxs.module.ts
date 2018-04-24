import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';

import { AuxService, AuxSelectedService } from './+shared/_index';
import { AuxListComponent } from './aux-list/aux-list.component';
import { AuxAddComponent } from './aux-add/aux-add.component';

import { AuxActivitiesComponent } from './aux-detail/activities/aux-activities.component';
import { AuxAssignComponent } from './aux-detail/assign/aux-assign.component';
import { AuxEditComponent } from './aux-detail/edit/aux-edit.component';
import { AuxSpecComponent } from './aux-detail/spec/aux-spec.component';
import { AuxZoneComponent } from './aux-detail/zones/aux-zone.component';
import { AuxZonesComponent } from './aux-detail/zones/aux-zones.component';
import { AuxDescriptionComponent } from './aux-detail/aux-description.component';
import { AuxDetailComponent } from './aux-detail/aux-detail.component';

import { AuxsComponent } from './auxs.component';

@NgModule({
    declarations: [
        AuxListComponent,
        AuxAddComponent,
        AuxActivitiesComponent,
        AuxAssignComponent,
        AuxEditComponent,
        AuxSpecComponent,
        AuxZoneComponent,
        AuxZonesComponent,
        AuxDescriptionComponent,
        AuxDetailComponent,
        AuxsComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [AuxService, AuxSelectedService]
})
export class AuxsModule { }
