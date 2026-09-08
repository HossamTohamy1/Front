import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | undefined | null, currency = 'SAR'): string {
    if (value === undefined || value === null) return `0 ${currency}`;
    return `${value.toLocaleString('en-US')} ${currency}`;
  }
}
