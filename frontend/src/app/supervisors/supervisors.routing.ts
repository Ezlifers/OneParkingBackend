import { Routes } from '@angular/router';

import { SupervisorsComponent } from './supervisors.component';
import { SupervisorListComponent } from './supervisor-list/supervisor-list.component';
import { SupervisorAddComponent } from './supervisor-add/supervisor-add.component';
import { SupervisorDetailComponent } from './supervisor-detail/supervisor-detail.component';

export const supervisorRoutes: Routes = [
    {
        path: 'supervisores', component: SupervisorsComponent, children: [
            { path: '', component: SupervisorListComponent },
            { path: 'add', component: SupervisorAddComponent },
            { path: ':id', component: SupervisorDetailComponent }
        ]
    }

];
