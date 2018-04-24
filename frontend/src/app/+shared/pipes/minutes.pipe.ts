import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'min' })
export class MinutesPipe implements PipeTransform {

    transform(n: number, txt: boolean) {
        const m = n / 60;
        if (txt == null || txt) {
            return m + ' min';
        } else {
            return '' + m;
        }

    }
}
