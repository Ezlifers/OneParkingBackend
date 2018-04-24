import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zero' })
export class ZeroPipe implements PipeTransform {
    transform(n: number) {
        let num: string = '' + n;
        if (n < 10) {
            num = '0' + num;
        }
        return num;
    }
}
