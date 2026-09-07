import { Injectable, signal, effect } from '@angular/core';


export interface CategoryCardConfig {
    id: string;
    title: string;
    accent: string;
    description: string;
    path: string;
}

export interface CategoriesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerSubtitle: string;
    categories: CategoryCardConfig[];
}


const initialConfig: CategoriesPageConfig = {
    showTitle: true,
    headerTitle: 'CATEGORIES.TITLE',
    headerSubtitle: 'CATEGORIES.SUBTITLE',
    categories: [
        { id: 'men', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.MENS', description: 'CATEGORIES.MENS_DESC', path: '/all-shapers?type=men' },
        { id: 'women', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WOMENS', description: 'CATEGORIES.WOMENS_DESC', path: '/all-shapers?type=women' },
        { id: 'postpartum', title: 'CATEGORIES.POST', accent: 'CATEGORIES.MATERNITY', description: 'CATEGORIES.MATERNITY_DESC', path: '/all-shapers?type=postpartum' },
        { id: 'sport', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.SPORTS', description: 'CATEGORIES.SPORTS_DESC', path: '/all-shapers?type=sport' },
        { id: 'full-body', title: 'CATEGORIES.FULL_BODY', accent: 'CATEGORIES.BODY', description: 'CATEGORIES.FULL_BODY_DESC', path: '/all-shapers?type=full-body' },
        { id: 'waist', title: 'CATEGORIES.SHAPERS', accent: 'CATEGORIES.WAIST', description: 'CATEGORIES.WAIST_DESC', path: '/all-shapers?type=waist' }
    ]
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesPageConfigService {
  private readonly storageKey = 'loxxking-categories-page-config';

  readonly pageConfig = signal<CategoriesPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: CategoriesPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): CategoriesPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): CategoriesPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}
