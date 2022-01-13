import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marginRound'
})
export class MarginRoundPipe implements PipeTransform {

  transform(value: number | string, digit: number = 2): string | null {
    if (typeof(value) === 'number') {
      return (value * 100).toFixed(digit)
    } else {
      const toNumber = +value;
      return (toNumber * 100).toFixed(digit)
    }
  }

}
