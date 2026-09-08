import { Injectable, signal, effect } from '@angular/core';


export interface MyOrdersPageConfig {
    headerTitle: string;
    headerSubtitle: string;
    
    phonePlaceholder: string;
    orderPlaceholder: string;
    buttonText: string;
    
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
    
    notFoundTitle: string;
    notFoundText: string;
    
    showSupportCard: boolean;
    supportTitle: string;
    supportText: string;
}


const initialConfig: MyOrdersPageConfig = {
    headerTitle: 'ORDERS.TRACK',
    headerSubtitle: 'ORDERS.TRACK_DESC',
    
    phonePlaceholder: 'COMMON.PHONE',
    orderPlaceholder: 'COMMON.ORDER_NUMBER',
    buttonText: 'ORDERS.TRACK',
    
    emptyTitle: 'ORDERS.NO_SHIPPED',
    emptyText: 'ORDERS.NO_ORDERS_DESC',
    emptyCta: 'COMMON.START_SHOPPING_FEM',
    
    notFoundTitle: 'ORDERS.NOT_FOUND',
    notFoundText: 'ORDERS.TRY_AGAIN',
    
    showSupportCard: true,
    supportTitle: 'ORDERS.HELP_TITLE',
    supportText: 'ORDERS.HELP_DESC'
}

@Injectable({
  providedIn: 'root'
})
export class MyOrdersPageConfigService {
  private readonly storageKey = 'loxxking-myorders-page-config';

  readonly pageConfig = signal<MyOrdersPageConfig>(this.loadInitialConfig());

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

  updateConfig(newConfig: MyOrdersPageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): MyOrdersPageConfig {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return this.mergeWithInitial(parsed);
      } catch (e) {}
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): MyOrdersPageConfig {
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return { ...initialConfig, ...parsed };
    }
    return parsed;
  }
}
