import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeMinute' })
export class TimeMinutePipe implements PipeTransform {
    transform(n: number) {
        let m: number = n % 60;
        n = n - m;
        let h: number = n / 60;

        let t: string;

        if (h < 12) {
            t = ' am';
        } else {
            h = h - 12;
            t = ' pm';
        }

        let min: string =  `${m}`;
        let hour: string =  `${h}`;

        if (m < 10) {
            min = `0${min}`;
        }


        if (h < 10) {
            hour = `0${hour}`;
        }

        return `${hour}:${min}${t}`;
    }
}
