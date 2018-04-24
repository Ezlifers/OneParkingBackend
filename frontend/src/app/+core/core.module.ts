import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavAsideComponent } from './dashboard/nav-aside/nav-aside.component';

import { SessionService } from './session.service';
import { NavigationService } from './navigation.service';

@NgModule({
    declarations: [
        LoginComponent,
        DashboardComponent,
        NavAsideComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    providers: [SessionService, NavigationService]
})

@NgModule({

})
export class CoreModule { }
