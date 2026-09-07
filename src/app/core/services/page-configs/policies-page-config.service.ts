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
    title: 'POLICIES.TITLE',
    subtitle: 'POLICIES.SUBTITLE',
    policies: [
        {
            key: 'privacy',
            gridTitle: 'POLICIES.PRIVACY',
            gridDescription: 'POLICIES.PRIVACY_DESC',
            icon: 'ShieldCheck',
            title: 'POLICIES.PRIVACY_SEC',
            subtitle: 'POLICIES.PRIVACY_TEXT',
            heroIcon: 'ShieldCheck',
            showWhatsApp: false,
            sections: [
                { title: 'POLICIES.INFO_COLLECTION', description: 'POLICIES.INFO_TEXT', icon: 'Database' }
            ]
        },
        {
            key: 'returns',
            gridTitle: 'POLICIES.RETURNS',
            gridDescription: 'POLICIES.RETURNS_DESC',
            icon: 'RotateCcw',
            title: 'POLICIES.RETURNS_POLICY',
            subtitle: 'POLICIES.RETURNS_TEXT',
            heroIcon: 'RotateCcw',
            showWhatsApp: true,
            sections: [
                { title: 'POLICIES.EXCHANGE_TERMS', bullets: ['POLICIES.CONDITION', 'POLICIES.EXCHANGE_PERIOD'], icon: 'PackageCheck' }
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

  private mergeWithInitial(parsed: any): PoliciesPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}
