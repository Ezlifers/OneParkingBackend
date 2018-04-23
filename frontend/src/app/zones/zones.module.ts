import { NgModule } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { SharedModule } from '../+shared/shared.module';

import { GOOGLE_MAP_KEY } from '../app.settings';

import { MapComponent, ZoneService, IOGlobalService, IOZoneService } from './+shared/_index';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneAddComponent } from './zone-add/zone-add.component';

import { ZoneBayComponent } from './zone-conf/bays/zone-bay.component';
import { ZoneBaysComponent } from './zone-conf/bays/zone-bays.component';
import { ZoneConfSheduleComponent } from './zone-conf/shedule/zone-conf-shedule.component';
import { ZoneConfComponent } from './zone-conf/zone-conf.component';

import { ZoneAuxComponent } from './zone-detail/auxs/zone-aux.component';
import { ZoneAuxsComponent } from './zone-detail/auxs/zone-auxs.component';
import { ZoneCarComponent } from './zone-detail/cars/zone-car.component';
import { ZoneCarsComponent } from './zone-detail/cars/zone-cars.component';
import { ZoneEditComponent } from './zone-detail/edit/zone-edit.component';
import { ZoneSheduleComponent } from './zone-detail/shedule/zone-shedule.component';
import { ZoneSpecComponent } from './zone-detail/spec/zone-spec.component';
import { ZoneDescriptionComponent } from './zone-detail/zone-description.component';
import { ZoneDetailComponent } from './zone-detail/zone-detail.component';

import { ZonesComponent } from './zones.component';

@NgModule({
    declarations: [
        MapComponent,
        ZoneListComponent,
        ZoneAddComponent,
        ZoneBayComponent,
        ZoneBaysComponent,
        ZoneConfSheduleComponent,
        ZoneConfComponent,
        ZoneAuxComponent,
        ZoneAuxsComponent,
        ZoneCarComponent,
        ZoneCarsComponent,
        ZoneEditComponent,
        ZoneSheduleComponent,
        ZoneSpecComponent,
        ZoneDescriptionComponent,
        ZoneDetailComponent,
        ZonesComponent
    ],
    imports: [
        SharedModule,
        AgmCoreModule.forRoot({
            apiKey: GOOGLE_MAP_KEY
        })],
    providers: [ZoneService, IOGlobalService, IOZoneService]
})
export class ZonesModule { }
