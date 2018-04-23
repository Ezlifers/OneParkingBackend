import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';

import { IncidentService } from './+shared/_index';
import { IncidentComponent } from './incident/incident.component';
import { IncidentsComponent } from './incidents.component';

@NgModule({
    declarations: [
        IncidentComponent,
        IncidentsComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [IncidentService]
})
export class IncidentsModule { }
