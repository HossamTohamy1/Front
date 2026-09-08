import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { Injectable, signal, effect } from '@angular/core';
import { categories as homeCategories, products as homeProducts } from '../../../shared/data/mockData';

type PageConfig = any;
const heroVisual = 'assets/home/hero-visual-hd.png';
const offerBanner = 'assets/home/offer-products-banner-hd.png';

const initialConfig: PageConfig = {
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      enabled: true,
      title: 'مشدات فاخرة وتشكيلة مميزة',
      image: heroVisual
    },
    {
      id: 'sec-benefits',
      type: 'benefits',
      enabled: true,
      benefits: [
        { id: 'b1', text: 'دفع عند الاستلام\nادفع بعد الاستلام', icon: 'CreditCard', enabled: true },
        { id: 'b2', text: 'شحن مجاني\nلجميع الطلبات في المملكة', icon: 'Truck', enabled: true },
        { id: 'b3', text: 'استرجاع مجاني\nخلال 14 يوم بكل سهولة', icon: 'RefreshCcw', enabled: true }
      ]
    },
    {
      id: 'sec-categories',
      type: 'categories',
      enabled: true,
      title: 'تسوق حسب الفئة',
      categories: homeCategories.map((c: any) => ({ id: c.id, name: c.label, image: c.image }))
    },
    {
      id: 'sec-bestsellers',
      type: 'bestsellers',
      enabled: true,
      title: 'الأكثر مبيعاً',
      products: homeProducts.map((p: any) => ({
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
      image: offerBanner
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class HomePageConfigService {
  private readonly storageKey = 'loxxking-homepage-config';

  readonly pageConfig = signal<PageConfig>(this.loadInitialConfig());

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
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: this.storageKey,
            newValue: JSON.stringify(config),
            storageArea: localStorage
          })
        );
      } catch (_) {}
    });
  }

  updateConfig(newConfig: PageConfig) {
    this.pageConfig.set(newConfig);
  }

  private loadInitialConfig(): PageConfig {
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
