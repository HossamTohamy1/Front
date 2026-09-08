import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PageConfig } from '../../models/config.model';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { homeCategories, homeProducts } from '../../../shared/data/homePageData';

const CONFIG_KEY = 'loxxking-homepage-config';

const initialConfig: PageConfig = {
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      enabled: true,
      title: 'HOME.HERO_TITLE',
      image: '/assets/home/hero-visual-hd.png'
    },
    {
      id: 'sec-benefits',
      type: 'benefits',
      enabled: true,
      benefits: [
        { id: 'b1', text: 'HOME.BENEFIT_1', icon: 'CreditCard', enabled: true },
        { id: 'b2', text: 'HOME.BENEFIT_2', icon: 'Truck', enabled: true },
        { id: 'b3', text: 'HOME.BENEFIT_3', icon: 'RefreshCcw', enabled: true }
      ]
    },
    {
      id: 'sec-categories',
      type: 'categories',
      enabled: true,
      title: 'HOME.SHOP_BY_CATEGORY',
      categories: homeCategories.map(c => ({ id: c.id, name: c.label, image: c.image }))
    },
    {
      id: 'sec-bestsellers',
      type: 'bestsellers',
      enabled: true,
      title: 'HOME.BEST_SELLERS',
      products: homeProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.oldPrice,
        image: p.image,
        discount: p.discount ? `-${p.discount}%` : undefined,
        rating: p.rating,
        reviewsCount: p.reviews
      }))
    },
    {
      id: 'sec-promo',
      type: 'promo',
      enabled: true,
      image: '/assets/home/offer-products-banner-hd.png'
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class HomePageConfigService {
  pageConfig = signal<PageConfig>(this.getInitialConfig());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === CONFIG_KEY && e.newValue) {
          try {
            this.pageConfig.set(sanitizeWithInitial(JSON.parse(e.newValue), initialConfig));
          } catch (_) {}
        }
      });
    }
  }

  private getInitialConfig(): PageConfig {
    if (isPlatformBrowser(this.platformId)) {
      const saved = window.localStorage.getItem(CONFIG_KEY);
      if (saved) {
        try {
          const clean = sanitizeWithInitial(JSON.parse(saved), initialConfig);
          window.localStorage.setItem(CONFIG_KEY, JSON.stringify(clean));
          return clean;
        } catch (_) {}
      }
    }
    return initialConfig;
  }

  setPageConfig(config: PageConfig) {
    this.pageConfig.set(config);
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      try {
        window.dispatchEvent(new StorageEvent('storage', {
          key: CONFIG_KEY,
          newValue: JSON.stringify(config),
          storageArea: window.localStorage,
        }));
      } catch (_) {}
    }
  }
}
