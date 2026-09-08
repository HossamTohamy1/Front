import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicDate',
  standalone: true,
})
export class ArabicDatePipe implements PipeTransform {
  transform(value?: string | Date): string {
    if (!value) return '';
    const str = typeof value === 'string' ? value : value.toISOString();
    return str.slice(0, 10);
  }
}
