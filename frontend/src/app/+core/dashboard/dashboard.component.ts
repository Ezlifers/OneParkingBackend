import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../_index';

declare var $: any;

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    constructor(public nav: NavigationService) {

    }

    ngOnInit() {
        $('.button-collapse').sideNav();
    }

}
