import { Routes } from '@angular/router';

import { ZonesComponent } from './zones.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { ZoneAddComponent } from './zone-add/zone-add.component';
import { ZoneDetailComponent } from './zone-detail/zone-detail.component';

export const zoneRoutes: Routes = [
    {
        path: 'zonas', component: ZonesComponent, children: [
            { path: '', component: ZoneListComponent },
            { path: 'add', component: ZoneAddComponent },
            { path: ':id', component: ZoneDetailComponent }
        ]
    }

];
