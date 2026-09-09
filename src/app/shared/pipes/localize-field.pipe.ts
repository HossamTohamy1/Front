import { Pipe, PipeTransform } from '@angular/core';
import { LangService } from '../../core/services/lang/lang.service';

@Pipe({
  name: 'localize',
  standalone: true,
  pure: false
})
export class LocalizeFieldPipe implements PipeTransform {
  constructor(private langService: LangService) {}

  transform(defaultText: string, textAr?: string, textEn?: string): string {
    const lang = this.langService.effectiveLang();
    
    if (lang === 'en' && textEn) {
      return textEn;
    }
    
    if (lang === 'ar' && textAr) {
      return textAr;
    }

    // Fallback logic
    if (lang === 'en') {
      return textEn || defaultText || textAr || '';
    }
    return textAr || defaultText || textEn || '';
  }
}
