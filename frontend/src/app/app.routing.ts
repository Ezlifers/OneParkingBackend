import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './+core/not-found/not-found.component';
import { LoginComponent } from './+core/login/login.component';
import { DashboardComponent } from './+core/dashboard/dashboard.component';

import { AuthGuardService } from './+core/_index';

import { zoneRoutes } from './zones/zones.routing';
import { auxRoutes } from './auxs/auxs.routing';
import { supervisorRoutes } from './supervisors/supervisors.routing';
import { incidentRoutes } from './incidents/incidents.routing';
import { profileRoutes } from './profile/profile.routing';
import { configRoutes } from './config/config.routing';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'dashboard', component: DashboardComponent, children: [
            ...zoneRoutes,
            ...auxRoutes,
            ...supervisorRoutes,
            ...incidentRoutes,
            ...profileRoutes,
            ...configRoutes,
            { path: '', redirectTo: 'zonas', pathMatch: 'full' }
        ]
    },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ], exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }