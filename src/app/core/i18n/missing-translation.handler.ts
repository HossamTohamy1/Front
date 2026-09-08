import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    const key = params.key;
    if (!key) return key;

    const translate = params.translateService as any;
    let lang = 'ar';
    if (typeof translate.getCurrentLang === 'function') {
      lang = translate.getCurrentLang() || 'ar';
    } else if (typeof translate.currentLang === 'function') {
      lang = translate.currentLang() || 'ar';
    } else if (typeof translate.currentLang === 'string') {
      lang = translate.currentLang;
    }

    // If active language is Arabic, Arabic keys should remain as-is
    if (lang === 'ar') {
      return key;
    }

    // Try direct dictionary lookup in loaded translations (bypassing ngx-translate's dot-splitting)
    try {
      const store = translate.store;
      if (store && typeof store.getTranslations === 'function') {
        const currentDict = store.getTranslations(lang);
        if (currentDict) {
          if (currentDict[key] !== undefined) return currentDict[key];
          const trimmed = key.trim();
          if (currentDict[trimmed] !== undefined) return currentDict[trimmed];
          // Try without trailing dots
          const withoutDot = key.replace(/\.+$/, '');
          if (currentDict[withoutDot] !== undefined) return currentDict[withoutDot];
        }

        const fallbackLang = typeof translate.getFallbackLang === 'function' ? translate.getFallbackLang() : null;
        if (fallbackLang && fallbackLang !== lang) {
          const fallbackDict = store.getTranslations(fallbackLang);
          if (fallbackDict) {
            if (fallbackDict[key] !== undefined) return fallbackDict[key];
            const trimmed = key.trim();
            if (fallbackDict[trimmed] !== undefined) return fallbackDict[trimmed];
            const withoutDot = key.replace(/\.+$/, '');
            if (fallbackDict[withoutDot] !== undefined) return fallbackDict[withoutDot];
          }
        }
      }
    } catch (_) {}

    return key;
  }
}
