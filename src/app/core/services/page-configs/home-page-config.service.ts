import { Injectable, signal, effect, PLATFORM_ID, Inject, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, from } from 'rxjs';
import { debounceTime, map, catchError } from 'rxjs/operators';
import { PageConfig } from '../../models/config.model';
import { sanitizeWithInitial } from '../../utils/config-sanitizer';
import { homeCategories, homeProducts } from '../../../shared/data/homePageData';
import { environment } from '../../../../environments/environment';

const CONFIG_KEY = 'loxxking-homepage-config';
const INSTANCE_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : Math.random().toString(36).substring(2) + Date.now().toString(36);

const heroVisual = '/assets/home/hero-visual-hd.png';
const offerBanner = '/assets/home/offer-products-banner-hd.png';

const initialConfig: PageConfig = {
  sections: [
    {
      id: 'sec-hero',
      type: 'hero',
      enabled: true,
      title: 'مشدات فاخرة وتشكيلة مميزة',
      image: heroVisual,
      slides: [
        { id: 'slide-1', image: heroVisual, title: 'شد أقوى\nوقوام أفضل' }
      ]
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
      showTitle: true,
      categories: homeCategories.map((c) => ({ id: c.id, name: c.label, image: c.image }))
    },
    {
      id: 'sec-bestsellers',
      type: 'bestsellers',
      enabled: true,
      title: 'الأكثر مبيعاً',
      showTitle: true,
      products: homeProducts.map((p) => ({
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
  private readonly storageKey = CONFIG_KEY;
  private readonly http = inject(HttpClient);

  readonly pageConfig = signal<PageConfig>(this.loadInitialConfig());
  
  private updateSubject = new Subject<PageConfig>();

  private zone = inject(NgZone);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // 0. Setup debounced backend sync
      this.updateSubject.pipe(
        debounceTime(750)
      ).subscribe((newConfig) => {
        const payload = {
          sectionsJson: JSON.stringify(newConfig.sections)
        };
        this.http.put(`${environment.apiUrl}/home-page-config`, payload).subscribe({
          error: (err) => {
            console.warn('Could not persist homepage config to server, retaining local cache:', err);
          }
        });
      });

      // 1. Fetch persistent configuration from Backend API on boot
      this.fetchFromBackend();

      // 2. Cross-tab/frame synchronization with echo prevention
      window.addEventListener('storage', (e: StorageEvent) => {
        if ((e as any).__sourceInstanceId === INSTANCE_ID) {
          return; // Discard self-triggered synthetic events
        }

        if (e.key === this.storageKey && e.newValue) {
          try {
            const updated = JSON.parse(e.newValue);
            this.zone.run(() => { this.pageConfig.set(this.mergeWithInitial(updated)); });
          } catch (_) {}
        }
      });

      // 3. Keep local cache in sync and broadcast to preview iframes
      effect(() => {
        const config = this.pageConfig();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(config));
        } catch (_) {}

        try {
          const event = new StorageEvent('storage', {
            key: this.storageKey,
            newValue: JSON.stringify(config),
            storageArea: localStorage
          });
          (event as any).__sourceInstanceId = INSTANCE_ID;
          window.dispatchEvent(event);
        } catch (_) {}
      });
    }
  }

  updateConfig(newConfig: PageConfig) {
    // 1. Optimistic local update
    this.zone.run(() => { this.pageConfig.set(newConfig); });

    // 2. Persist to Backend via debounced subject
    this.updateSubject.next(newConfig);
  }

  setPageConfig(newConfig: PageConfig) {
    this.updateConfig(newConfig);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.apiUrl}/home-page-config/upload-image`, formData).pipe(
      map(res => ({ url: (res?.data?.url || res?.data || res?.url) as string })),
      catchError(() => {
        return from(
          new Promise<{ url: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ url: reader.result as string });
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          })
        );
      })
    );
  }

  private fetchFromBackend() {
    this.http.get<any>(`${environment.apiUrl}/home-page-config`).subscribe({
      next: (res) => {
        const data = res?.data || res;
        if (data?.sectionsJson && data.sectionsJson.length > 2 && data.sectionsJson !== '[]') {
          try {
            const parsedSections = JSON.parse(data.sectionsJson);
            if (Array.isArray(parsedSections) && parsedSections.length > 0) {
              const merged = this.mergeWithInitial({ sections: parsedSections });
              this.zone.run(() => { this.pageConfig.set(merged); });
            }
          } catch (e) {
            console.error('Failed to parse sectionsJson from backend:', e);
          }
        }
      },
      error: () => {
        // Fallback silently to localStorage cache
      }
    });
  }

  private loadInitialConfig(): PageConfig {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return this.mergeWithInitial(parsed);
        } catch (_) {}
      }
    }
    return initialConfig;
  }

  private mergeWithInitial(parsed: any): PageConfig {
    return sanitizeWithInitial(parsed, initialConfig);
  }
}
