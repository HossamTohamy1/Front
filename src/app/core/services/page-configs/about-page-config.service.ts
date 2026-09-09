import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect, inject, NgZone } from '@angular/core';


const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

export interface AboutReasonConfig {
    id: string;
    icon: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    text: string;
    textAr?: string;
    textEn?: string;
}

export interface AboutValueConfig {
    id: string;
    icon: string;
    label: string;
    labelAr?: string;
    labelEn?: string;
}

export interface AboutContactConfig {
    id: string;
    icon: string;
    label: string;
    labelAr?: string;
    labelEn?: string;
    link: string;
}

export interface AboutPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerTitleAr?: string;
    headerTitleEn?: string;
    headerSubtitle: string;
    headerSubtitleAr?: string;
    headerSubtitleEn?: string;
    
    showIntroSection: boolean;
    introText: string;
    introTextAr?: string;
    introTextEn?: string;
    
    showReasonsSection: boolean;
    reasonsTitle: string;
    reasonsTitleAr?: string;
    reasonsTitleEn?: string;
    reasons: AboutReasonConfig[];
    
    showVisionSection: boolean;
    visionTitle: string;
    visionTitleAr?: string;
    visionTitleEn?: string;
    visionText: string;
    visionTextAr?: string;
    visionTextEn?: string;
    
    showMissionSection: boolean;
    missionTitle: string;
    missionTitleAr?: string;
    missionTitleEn?: string;
    missionText: string;
    missionTextAr?: string;
    missionTextEn?: string;
    
    showValuesSection: boolean;
    valuesTitle: string;
    valuesTitleAr?: string;
    valuesTitleEn?: string;
    values: AboutValueConfig[];
    
    showContactSection: boolean;
    contactTitle: string;
    contactTitleAr?: string;
    contactTitleEn?: string;
    contacts: AboutContactConfig[];
}


const initialConfig: AboutPageConfig = {
    showTitle: true,
    headerTitle: 'من نحن',
    headerSubtitle: 'لوكس كينج... ثقتك، راحتك، جمالك',
    
    showIntroSection: true,
    introText: 'لوكس كينج هو متجرك الموثوق لمشدات الجسم ومنتجات العناية بالجمال عالية الجودة.\n\nنحن نؤمن أن الثقة تبدأ من الراحة، ونختار لك الأفضل لتشعري بأجمل إطلالة كل يوم.',
    
    showReasonsSection: true,
    reasonsTitle: 'لماذا نحن؟',
    reasons: [
        { id: '1', icon: 'ShieldCheck', title: 'جودة استثنائية', text: 'نختار منتجاتنا بعناية فائقة لضمان أفضل النتائج.' },
        { id: '2', icon: 'Heart', title: 'راحة تامة', text: 'تصاميم تناسب الاستخدام اليومي دون إزعاج.' },
        { id: '3', icon: 'Star', title: 'نتائج ملحوظة', text: 'منتجات تساعدك على إبراز جمالك الطبيعي.' }
    ],
    
    showVisionSection: true,
    visionTitle: 'رؤيتنا',
    visionText: 'أن نكون الخيار الأول في مجال مشدات الجسم ومنتجات الجمال في الوطن العربي من خلال الجودة، المصداقية وخدمة العملاء المتميزة.',
    
    showMissionSection: true,
    missionTitle: 'رسالتنا',
    missionText: 'تقديم منتجات موثوقة وآمنة تساعدك على إبراز جمالك وثقتك بنفسك، مع تجربة تسوق سهلة، سريعة وآمنة.',
    
    showValuesSection: true,
    valuesTitle: 'قيمنا',
    values: [
        { id: '1', icon: 'ShieldCheck', label: 'المصداقية' },
        { id: '2', icon: 'Heart', label: 'العناية بالعميل' },
        { id: '3', icon: 'Star', label: 'الجودة العالية' },
        { id: '4', icon: 'Target', label: 'الابتكار المستمر' },
        { id: '5', icon: 'Check', label: 'الشفافية' }
    ],
    
    showContactSection: true,
    contactTitle: 'تواصل معنا',
    contacts: [
        { id: '1', icon: 'facebook', label: 'فيسبوك', link: 'https://facebook.com' },
        { id: '2', icon: 'instagram', label: 'إنستغرام', link: 'https://instagram.com' },
        { id: '3', icon: 'mail', label: 'بريد إلكتروني', link: 'mailto:support@loxxking.com' },
        { id: '4', icon: 'phone', label: 'اتصال', link: 'tel:+201000000000' },
        { id: '5', icon: 'whatsapp', label: 'واتساب', link: 'https://wa.me/201000000000' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class AboutPageConfigService {
  private readonly storageKey = 'loxxking-about-page-config';

  readonly pageConfig = signal<AboutPageConfig>(this.loadInitialConfig());
  private zone = inject(NgZone);

  constructor() {
    window.addEventListener('storage', (e: StorageEvent) => {
      if ((e as any).__sourceInstanceId === INSTANCE_ID) return; // Discard self-triggered synthetic events

      if (e.key === this.storageKey && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          this.zone.run(() => {
            this.pageConfig.set(this.mergeWithInitial(updated));
          });
        } catch (_) {}
      }
    });

    effect(() => {
      const config = this.pageConfig();
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      
      try {
        const event = new StorageEvent('storage', {
          key: this.storageKey,
          newValue: JSON.stringify(config),
          storageArea: localStorage,
        });
        (event as any).__sourceInstanceId = INSTANCE_ID;
        window.dispatchEvent(event);
      } catch (_) {}
    });
  }

  updateConfig(newConfig: AboutPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): AboutPageConfig {
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
