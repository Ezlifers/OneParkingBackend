import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TimeRange } from '../../+shared/_index'


declare var $: any;

@Component({
    selector: 'app-zone-shedule',
    templateUrl: './zone-shedule.component.html'
})
export class ZoneSheduleComponent{
    @Input() times: TimeRange[];

    goToSettings() {
        $('ul.tabs').tabs('select_tab', 'settings');
    }

}
