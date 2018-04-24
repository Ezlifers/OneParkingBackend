import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MinutesPipe, ZeroPipe, TimeMinutePipe } from './_index';
import { LoaderComponent } from './components/loader.component';


@NgModule({
    declarations: [MinutesPipe, ZeroPipe, TimeMinutePipe, LoaderComponent],
    imports: [CommonModule],
    exports: [CommonModule, FormsModule, RouterModule, LoaderComponent, MinutesPipe, ZeroPipe, TimeMinutePipe]
})
export class SharedModule { }
