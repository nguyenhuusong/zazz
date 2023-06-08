import { Pipe, PipeTransform } from '@angular/core';
import * as numeral from 'numeral';
@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: any): string {
    return numeral(value).format('0,0[.][000]');
  }

}
