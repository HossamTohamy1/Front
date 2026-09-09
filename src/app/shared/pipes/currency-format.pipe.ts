import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: false
})
export class CurrencyFormatPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(value: number | undefined | null, defaultCurrency?: string): string {
    // If no explicit currency passed, fallback to the dynamic translated one
    const currency = defaultCurrency || this.translate.instant('COMMON.CURRENCY');
    if (value === undefined || value === null) return `0 ${currency}`;
    return `${value.toLocaleString('en-US')} ${currency}`;
  }
}
