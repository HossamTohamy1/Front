import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface PolicySectionConfig {
    title: string;
    description?: string;
    icon: string;
    bullets?: string[];
}

export interface PolicyConfig {
    key: string;
    gridTitle: string;
    gridDescription: string;
    icon: string;
    title: string;
    subtitle: string;
    heroIcon: string;
    showWhatsApp: boolean;
    sections: PolicySectionConfig[];
}

export interface PoliciesPageConfig {
    title: string;
    subtitle: string;
    policies: PolicyConfig[];
}


const initialConfig: PoliciesPageConfig = {
    title: 'السياسات والمعلومات',
    subtitle: 'تعرف على سياسات المتجر وشروط استخدامه',
    policies: [
        {
            key: 'privacy',
            gridTitle: 'سياسة الخصوصية',
            gridDescription: 'كيف نحمي بياناتك ومعلوماتك',
            icon: 'ShieldCheck',
            title: 'سياسة الخصوصية والأمان',
            subtitle: 'نحن نأخذ خصوصيتك على محمل الجد، ونلتزم بحماية كافة بياناتك الشخصية وفقاً لأعلى معايير الأمان العالمية.',
            heroIcon: 'ShieldCheck',
            showWhatsApp: false,
            sections: [
                { title: 'جمع المعلومات', description: 'نحن نجمع فقط المعلومات الضرورية لإتمام طلباتك...', icon: 'Database' }
            ]
        },
        {
            key: 'returns',
            gridTitle: 'الاستبدال والاسترجاع',
            gridDescription: 'شروط إرجاع واستبدال المنتجات',
            icon: 'RotateCcw',
            title: 'سياسة الاستبدال والاسترجاع',
            subtitle: 'حرصاً منا على رضاكم، نوفر سياسة مرنة للاستبدال والاسترجاع...',
            heroIcon: 'RotateCcw',
            showWhatsApp: true,
            sections: [
                { title: 'شروط الاستبدال', bullets: ['يجب أن يكون المنتج في حالته الأصلية', 'الاستبدال خلال 14 يوما'], icon: 'PackageCheck' }
            ]
        }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class PoliciesPageConfigService {
  private readonly storageKey = 'loxxking-policies-page-config';

  readonly pageConfig = signal<PoliciesPageConfig>(this.loadInitialConfig());

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === this.storageKey && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          this.pageConfig.set(this.mergeWithInitial(updated));
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        }));
      } catch (_) {}
    });
  }

  updateConfig(newConfig: PoliciesPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): PoliciesPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): any {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}
