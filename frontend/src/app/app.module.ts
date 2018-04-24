import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app.routing';

import { CoreModule } from './+core/core.module';
import { ZonesModule } from './zones/zones.module';
import { AuxsModule } from './auxs/auxs.module';
import { SupervisorsModule } from './supervisors/supervisors.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ConfigModule } from './config/config.module';
import { ProfileModule } from './profile/profile.module';


import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    ZonesModule,
    AuxsModule,
    SupervisorsModule,
    IncidentsModule,
    ProfileModule,
    ConfigModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
