import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'margin'
})
export class MarginPipe implements PipeTransform {

  transform(value: number | string, digit: number = 2): string | null {
    if (typeof(value) === 'number') {
      return (Math.trunc(value*Math.pow(10, digit))/Math.pow(10, digit)).toString();
    } else {
      const toNumber = +value;
      return (Math.trunc(toNumber*Math.pow(10, digit))/Math.pow(10, digit)).toString()
    }
  }

}
