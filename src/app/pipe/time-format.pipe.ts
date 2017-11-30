import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: number, format: string): any {
    let s = parseInt(value.toString());
    let m = parseInt((s / 60).toString());
    let h = parseInt((s / 60 / 60).toString());
    let str = '';
    if ('hh:mm:ss' === format) {
      if (h < 10) {
        str += '0' + h;
      } else {
        str += h;
      }
      let mm = m - h * 60;
      if (mm < 10) {
        str += ':0' + mm;
      } else {
        str += ':' + mm;
      }
      let ss = s - m * 60;
      if (ss < 10) {
        str += ':0' + ss;
      } else {
        str += ':' + ss;
      }
    } else if ('mm:ss' === format) {
      if (m < 10) {
        str += '0' + m;
      } else {
        str += m;
      }
      let ss = s - m * 60;
      if (ss < 10) {
        str += ':0' + ss;
      } else {
        str += ':' + ss;
      }
    } else {
      str = s.toString();
    }
    return str;
  }

}
