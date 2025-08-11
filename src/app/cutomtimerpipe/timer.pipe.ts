import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeformat'
})
export class TimerPipe implements PipeTransform {

  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    const minute = minutes < 10 ? '0' + minutes:minutes.toString();
    const second = seconds < 10 ? '0' + seconds:seconds.toString();

    return `${minute}:${second}`;
  }

}
