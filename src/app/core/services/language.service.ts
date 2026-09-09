import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = `${environment.storagePrefix}lang`;
  public currentLang = signal<Language>('ar');

  constructor(private translate: TranslateService) {}

  init(): void {
    const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language;
    
    // Priority: Saved > Browser > Default ('ar')
    let defaultLang: Language = 'ar';
    
    if (savedLang === 'ar' || savedLang === 'en') {
      defaultLang = savedLang;
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase().substring(0, 2);
      if (browserLang === 'ar' || browserLang === 'en') {
        defaultLang = browserLang as Language;
      }
    }
    
    this.translate.addLangs(['ar', 'en']);
    this.translate.setFallbackLang(defaultLang);
    this.setLanguage(defaultLang);
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.updateDom(lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  private updateDom(lang: Language): void {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
}
