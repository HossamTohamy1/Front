import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';


export interface CategoryPageConfig {
    showTitle: boolean
}


const initialConfig: CategoryPageConfig = {
    showTitle: true,
}

@Injectable({
  providedIn: 'root'
})
export class CategoryPageConfigService {
  private readonly storageKey = 'loxxking-category-page-config';

  readonly pageConfig = signal<CategoryPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: CategoryPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CategoryPageConfig {
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
