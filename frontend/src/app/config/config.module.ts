import { NgModule } from '@angular/core';
import { SharedModule } from '../+shared/shared.module';

import { ConfigService } from './+shared/config.service';
import { ConfigEditComponent } from './config-edit/config-edit.component';
import { ConfigEditSheduleComponent } from './config-edit/shedule/config-edit-shedule.component';
import { ConfigSpecComponent } from './config-spec/config-spec.component';
import { ConfigSheduleComponent } from './config-spec/shedule/config-shedule.component';
import { ConfigComponent } from './config.component';

@NgModule({
    declarations: [
        ConfigEditSheduleComponent,
        ConfigEditComponent,
        ConfigSheduleComponent,
        ConfigSpecComponent,
        ConfigComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [ConfigService]
})
export class ConfigModule { }
