import { Injectable, signal, effect } from '@angular/core';


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
    headerSubtitle: 'ABOUT.SLOGAN',
    
    showIntroSection: true,
    introText: 'ABOUT.DESC',
    
    showReasonsSection: true,
    reasonsTitle: 'ABOUT.WHY_US',
    reasons: [
        { id: '1', icon: 'ShieldCheck', title: 'ABOUT.QUALITY', text: 'ABOUT.QUALITY_DESC' },
        { id: '2', icon: 'Heart', title: 'ABOUT.COMFORT', text: 'ABOUT.COMFORT_DESC' },
        { id: '3', icon: 'Star', title: 'ABOUT.RESULTS', text: 'ABOUT.RESULTS_DESC' }
    ],
    
    showVisionSection: true,
    visionTitle: 'ABOUT.VISION_TITLE',
    visionText: 'ABOUT.VISION_TEXT',
    
    showMissionSection: true,
    missionTitle: 'ABOUT.MISSION_TITLE',
    missionText: 'ABOUT.MISSION_TEXT',
    
    showValuesSection: true,
    valuesTitle: 'ABOUT.VALUES_TITLE',
    values: [
        { id: '1', icon: 'ShieldCheck', label: 'ABOUT.VALUE_1' },
        { id: '2', icon: 'Heart', label: 'ABOUT.VALUE_2' },
        { id: '3', icon: 'Star', label: 'ABOUT.VALUE_3' },
        { id: '4', icon: 'Target', label: 'ABOUT.VALUE_4' },
        { id: '5', icon: 'Check', label: 'ABOUT.VALUE_5' }
    ],
    
    showContactSection: true,
    contactTitle: 'CONTACT.TITLE',
    contacts: [
        { id: '1', icon: 'facebook', label: 'SOCIAL.FACEBOOK', link: 'https://facebook.com' },
        { id: '2', icon: 'instagram', label: 'SOCIAL.INSTAGRAM', link: 'https://instagram.com' },
        { id: '3', icon: 'mail', label: 'SOCIAL.EMAIL', link: 'mailto:support@loxxking.com' },
        { id: '4', icon: 'phone', label: 'SOCIAL.CALL', link: 'tel:+201000000000' },
        { id: '5', icon: 'whatsapp', label: 'CONTACT.WHATSAPP', link: 'https://wa.me/201000000000' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class AboutPageConfigService {
  private readonly storageKey = 'loxxking-about-page-config';

  readonly pageConfig = signal<AboutPageConfig>(this.loadInitialConfig());

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

  private mergeWithInitial(parsed: any): AboutPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}
