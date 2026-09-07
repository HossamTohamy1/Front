import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AboutReasonConfig {
    id: string;
    icon: string;
    title: string;
    text: string;
}

export interface AboutValueConfig {
    id: string;
    icon: string;
    label: string;
}

export interface AboutContactConfig {
    id: string;
    icon: string;
    label: string;
    link: string;
}

export interface AboutPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerSubtitle: string;
    
    showIntroSection: boolean;
    introText: string;
    
    showReasonsSection: boolean;
    reasonsTitle: string;
    reasons: AboutReasonConfig[];
    
    showVisionSection: boolean;
    visionTitle: string;
    visionText: string;
    
    showMissionSection: boolean;
    missionTitle: string;
    missionText: string;
    
    showValuesSection: boolean;
    valuesTitle: string;
    values: AboutValueConfig[];
    
    showContactSection: boolean;
    contactTitle: string;
    contacts: AboutContactConfig[];
}

const initialConfig: AboutPageConfig = {
    showTitle: true,
    headerTitle: 'ABOUT.TITLE',
    headerSubtitle: 'Ù„ÙˆÙƒØ³ ÙƒÙŠÙ†Ø¬... ÙˆØ¬Ù‡ØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰ Ù„Ù„Ø£Ù†Ø§Ù‚Ø© Ø§Ù„Ø¹ØµØ±ÙŠØ©',
    
    showIntroSection: true,
    introText: 'Ù„ÙˆÙƒØ³ ÙƒÙŠÙ†Ø¬ Ù‡ÙŠ Ø¹Ù„Ø§Ù…Ø© ØªØ¬Ø§Ø±ÙŠØ© Ø±Ø§Ø¦Ø¯Ø©\nØªØ£Ø³Ø³Øª ÙÙŠ Ù…ØµØ± ÙˆØªÙ‡ØªÙ… Ø¨ØªÙ‚Ø¯ÙŠÙ… Ø£Ø²ÙŠØ§Ø¡\nØ¹ØµØ±ÙŠØ© ØªÙ„Ø¨ÙŠ ÙƒØ§ÙØ© Ø§Ù„Ø£Ø°ÙˆØ§Ù‚.\nÙ†Ø­Ù† Ù†Ø³Ø¹Ù‰ Ù„Ø£Ù† Ù†ÙƒÙˆÙ† Ø®ÙŠØ§Ø±Ùƒ Ø§Ù„Ø£ÙˆÙ„ Ù…Ù† Ø®Ù„Ø§Ù„\nØªÙˆÙÙŠØ± Ø¬ÙˆØ¯Ø© Ø¹Ø§Ù„ÙŠØ© Ø¨Ø£Ø³Ø¹Ø§Ø± ØªÙ†Ø§ÙØ³ÙŠØ©\nÙ„ØªÙ†Ø§Ø³Ø¨ Ø¬Ù…ÙŠØ¹ Ø§Ù„ÙØ¦Ø§Øª.',
    
    showReasonsSection: true,
    reasonsTitle: 'STOREFRONT.AUTO_STR_265',
    reasons: [
        { id: '1', icon: 'ShieldCheck', title: 'ABOUT.QUALITY', text: 'Ù†Ø­Ø±Øµ ÙÙŠ Ù…Ù†ØªØ¬Ø§ØªÙ†Ø§ Ø¹Ù„Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø£ÙØ¶Ù„ Ø§Ù„Ø®Ø§Ù…Ø§Øª Ù„Ø¶Ù…Ø§Ù† Ø§Ù„Ø±Ø§Ø­Ø©.' },
        { id: '2', icon: 'Check', title: 'STOREFRONT.AUTO_STR_350', text: 'Ù†Ù‚Ø¯Ù… Ù„Ùƒ Ù…Ù†ØªØ¬Ø§Øª Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ø¨Ø£Ø³Ø¹Ø§Ø± ØªÙ†Ø§ÙØ³ÙŠØ©.' },
        { id: '3', icon: 'Star', title: 'STOREFRONT.AUTO_STR_291', text: 'Ù†ØªÙ…ÙŠØ² Ø¨ØªÙˆÙÙŠØ± Ø£Ø­Ø¯Ø« ØµÙŠØ­Ø§Øª Ø§Ù„Ù…ÙˆØ¶Ø© Ø§Ù„ØªÙŠ ØªÙ†Ø§Ø³Ø¨ Ø§Ù„Ø¬Ù…ÙŠØ¹.' }
    ],
    
    showVisionSection: true,
    visionTitle: 'ABOUT.VISION_TITLE',
    visionText: 'Ø£Ù† Ù†ÙƒÙˆÙ† Ø§Ù„Ø®ÙŠØ§Ø± Ø§Ù„Ø£ÙˆÙ„ ÙÙŠ Ø¹Ø§Ù„Ù… Ø§Ù„Ø£Ø²ÙŠØ§Ø¡ ÙˆØ§Ù„Ù…ÙˆØ¶Ø© ÙÙŠ Ø§Ù„Ø´Ø±Ù‚ Ø§Ù„Ø£ÙˆØ³Ø·\nÙ…Ù† Ø®Ù„Ø§Ù„ ØªÙ‚Ø¯ÙŠÙ… ØªØµÙ…ÙŠÙ…Ø§Øª Ø¹ØµØ±ÙŠØ© Ù…Ø¨ØªÙƒØ±Ø© ØªÙ„ÙŠÙ‚ Ø¨Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§.',
    
    showMissionSection: true,
    missionTitle: 'ABOUT.MISSION_TITLE',
    missionText: 'ØªÙ„Ø¨ÙŠØ© ØªØ·Ù„Ø¹Ø§Øª Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§ Ø¨ØªÙˆÙÙŠØ± Ø£Ø­Ø¯Ø« ØµÙŠØ­Ø§Øª Ø§Ù„Ù…ÙˆØ¶Ø© Ø¨Ø¬ÙˆØ¯Ø© ØªÙ†Ø§ÙØ³ÙŠØ©\nÙ…Ø¹ Ø§Ù„ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ø±Ø§Ø­Ø© ÙˆØ±Ø¶Ø§ Ø¹Ù…Ù„Ø§Ø¦Ù†Ø§.',
    
    showValuesSection: true,
    valuesTitle: 'ABOUT.VALUES_TITLE',
    values: [
        { id: '1', icon: 'ShieldCheck', label: 'STOREFRONT.AUTO_STR_418' },
        { id: '2', icon: 'Check', label: 'ABOUT.VALUE_2' },
        { id: '3', icon: 'Star', label: 'ABOUT.VALUE_3' },
        { id: '4', icon: 'Target', label: 'ABOUT.VALUE_4' },
        { id: '5', icon: 'Check', label: 'ABOUT.VALUE_5' }
    ],
    
    showContactSection: true,
    contactTitle: 'CONTACT.TITLE',
    contacts: [
        { id: '1', icon: 'facebook', label: 'SOCIAL.FACEBOOK', link: 'https://facebook.com' },
        { id: '2', icon: 'instagram', label: 'STOREFRONT.AUTO_STR_435', link: 'https://instagram.com' },
        { id: '3', icon: 'mail', label: 'SOCIAL.EMAIL', link: 'mailto:support@loxxking.com' },
        { id: '4', icon: 'phone', label: 'SOCIAL.CALL', link: 'tel:+201000000000' },
        { id: '5', icon: 'whatsapp', label: 'CONTACT.WHATSAPP', link: 'https://wa.me/201000000000' }
    ]
};

@Injectable({
  providedIn: 'root'
})
export class AboutPageConfigService {
  private configSubject = new BehaviorSubject<AboutPageConfig>(initialConfig);
  config$: Observable<AboutPageConfig> = this.configSubject.asObservable();
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadConfig();

    if (this.isBrowser) {
      window.addEventListener('storage', this.onStorage.bind(this));
    }
  }

  private loadConfig(): void {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('loxxking-about-page-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.configSubject.next({ ...initialConfig, ...parsed });
      } catch (e) {
      }
    }
  }

  private onStorage(e: StorageEvent): void {
    if (e.key !== 'loxxking-about-page-config' || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue);
      this.configSubject.next({ ...initialConfig, ...parsed });
    } catch (_) {}
  }

  setConfig(config: AboutPageConfig): void {
    this.configSubject.next(config);
    if (this.isBrowser) {
      localStorage.setItem('loxxking-about-page-config', JSON.stringify(config));
      try {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'loxxking-about-page-config',
            newValue: JSON.stringify(config),
            storageArea: localStorage
          })
        );
      } catch (_) {}
    }
  }
}
