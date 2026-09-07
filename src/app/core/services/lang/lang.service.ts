import { Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  private readonly LANG_KEY = 'lk-lang';
  
  lang = signal<Lang>(this.getInitialLang());
  dir = computed(() => this.lang() === 'ar' ? 'rtl' : 'ltr');

  constructor(private translate: TranslateService) {
    this.applyLang(this.lang());
  }

  private getInitialLang(): Lang {
    const stored = window.localStorage.getItem(this.LANG_KEY);
    return stored === 'en' ? 'en' : 'ar';
  }

  setLang(nextLang: Lang) {
    this.lang.set(nextLang);
    this.applyLang(nextLang);
  }

  private applyLang(lang: Lang) {
    this.translate.use(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    window.localStorage.setItem(this.LANG_KEY, lang);
  }
}
