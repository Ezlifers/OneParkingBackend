import { Routes } from '@angular/router';

import { AuxsComponent } from './auxs.component';
import { AuxListComponent } from './aux-list/aux-list.component';
import { AuxAddComponent } from './aux-add/aux-add.component';
import { AuxDetailComponent } from './aux-detail/aux-detail.component';

export const auxRoutes: Routes = [
    {
        path: 'auxiliares', component: AuxsComponent, children: [
            { path: '', component: AuxListComponent },
            { path: 'add', component: AuxAddComponent },
            { path: ':id', component: AuxDetailComponent }
        ]
    }

];
