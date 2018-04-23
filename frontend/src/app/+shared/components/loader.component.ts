import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html'
})
export class LoaderComponent {

    @Input() size: string;
    @Input() show: boolean;
    @Input() center: boolean;

}
