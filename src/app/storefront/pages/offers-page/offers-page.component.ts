import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, Clock3, Heart, Percent, ShoppingBag } from 'lucide-angular';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';

export type SizeChartRow = {
    size: string;
    waistCm: string;
    hipsCm: string;
    waistIn: string;
    hipsIn: string;
};

export type Product = {
    id: string;
    slug: string;
    nameEn: string;
    nameAr: string;
    descEn: string;
    descAr: string;
    price: number;
    originalPrice: number;
    images: string[];
    category: string;
    sizes: string[];
    sizeChart: SizeChartRow[];
    stock: number;
    rating: number;
    reviewCount: number;
    badge: string;
};

export type BundleOffer = {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    originalPrice: number;
    saving: number;
    imageType: 'three' | 'mixed-two' | 'black-two' | 'beige-two';
    quantities: [number, number];
};

export type OffersPageConfig = {
    heroTitle: string;
    heroSubtitle: string;
    showHero: boolean;
    currentOffersTitle: string;
    bundlesTitle: string;
    bundlesSubtitle: string;
};

const DEFAULT_CONFIG: OffersPageConfig = {
    heroTitle: 'OFFERS.TITLE',
    heroSubtitle: 'OFFERS.SUBTITLE',
    showHero: true,
    currentOffersTitle: 'OFFERS.CURRENT',
    bundlesTitle: 'OFFERS.BUNDLES',
    bundlesSubtitle: 'OFFERS.BUNDLES_DESC',
};

const sizeChart: SizeChartRow[] = [
    { size: 'S', waistCm: '67â€“73', hipsCm: '89â€“94', waistIn: '26â€“29', hipsIn: '35â€“37' },
    { size: 'M', waistCm: '74â€“80', hipsCm: '95â€“100', waistIn: '29â€“31', hipsIn: '37â€“39' },
    { size: 'L', waistCm: '81â€“87', hipsCm: '101â€“106', waistIn: '32â€“34', hipsIn: '40â€“42' },
    { size: 'XL', waistCm: '88â€“94', hipsCm: '107â€“113', waistIn: '35â€“37', hipsIn: '42â€“44' },
];

const blackShaper = 'assets/home/product-classic-black-hd.png';
const beigeShaper = 'assets/home/product-beige-square-hd.png';

const currentOffers: Product[] = [
    {
        id: 'offer-black-classic',
        slug: 'offer-black-classic',
        nameEn: 'Classic Black Waist Shaper',
        nameAr: 'SHARED.AUTO_STR_51',
        descEn: 'Classic black waist shaper with firm support.',
        descAr: 'Ù…Ø´Ø¯ Ø®ØµØ± Ø£Ø³ÙˆØ¯ ÙƒÙ„Ø§Ø³ÙŠÙƒ Ø¨Ø¯Ø¹Ù… Ù‚ÙˆÙŠ ÙˆÙ…Ø±ÙŠØ­.',
        price: 200,
        originalPrice: 250,
        images: [blackShaper],
        category: 'waist-trainers',
        sizes: ['S', 'M', 'L', 'XL'],
        sizeChart,
        stock: 28,
        rating: 4.8,
        reviewCount: 256,
        badge: '-20%',
    },
    {
        id: 'offer-beige-daily',
        slug: 'offer-beige-daily',
        nameEn: 'Comfort Daily Shaper',
        nameAr: 'STOREFRONT.AUTO_STR_308',
        descEn: 'Soft beige everyday waist shaper.',
        descAr: 'Ù…Ø´Ø¯ ÙŠÙˆÙ…ÙŠ Ø¨ÙŠØ¬ Ù…Ø±ÙŠØ­ ÙˆØ®ÙÙŠÙ Ù„Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø·ÙˆÙŠÙ„.',
        price: 184,
        originalPrice: 230,
        images: [beigeShaper],
        category: 'waist-trainers',
        sizes: ['S', 'M', 'L', 'XL'],
        sizeChart,
        stock: 36,
        rating: 4.7,
        reviewCount: 181,
        badge: '-20%',
    },
];

const bundleOffers: BundleOffer[] = [
    {
        id: 'bundle-three',
        title: 'STOREFRONT.AUTO_STR_400',
        subtitle: 'STOREFRONT.AUTO_STR_230',
        price: 399,
        originalPrice: 540,
        saving: 141,
        imageType: 'three',
        quantities: [2, 1],
    },
    {
        id: 'bundle-two',
        title: 'STOREFRONT.AUTO_STR_369',
        subtitle: 'STOREFRONT.AUTO_STR_231',
        price: 299,
        originalPrice: 360,
        saving: 61,
        imageType: 'mixed-two',
        quantities: [1, 1],
    },
    {
        id: 'bundle-black-two',
        title: 'STOREFRONT.AUTO_STR_370',
        subtitle: 'STOREFRONT.AUTO_STR_129',
        price: 349,
        originalPrice: 440,
        saving: 91,
        imageType: 'black-two',
        quantities: [2, 0],
    },
    {
        id: 'bundle-beige-two',
        title: 'STOREFRONT.AUTO_STR_401',
        subtitle: 'STOREFRONT.AUTO_STR_144',
        price: 329,
        originalPrice: 420,
        saving: 91,
        imageType: 'beige-two',
        quantities: [0, 2],
    },
];

@Component({
  selector: 'app-offers-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, LucideAngularModule, StoreLayoutComponent, HomeHeaderComponent],
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.css']
})
export class OffersPageComponent implements OnInit, OnDestroy {
  ArrowLeft = ArrowLeft;
  Clock3 = Clock3;
  Heart = Heart;
  Percent = Percent;
  ShoppingBag = ShoppingBag;

  pageConfig = signal<OffersPageConfig>(DEFAULT_CONFIG);
  currentOffers = currentOffers;
  bundleOffers = bundleOffers;
  
  offerLeftBackground = 'assets/home/offer-left-background.png';
  offerProducts = 'assets/home/offer-products-exact.png';
  bundleBlackShaper = 'assets/offers/product-black-transparent.png';
  bundleBeigeShaper = 'assets/offers/product-beige-transparent.png';
  multiBuyThreeIcon = 'assets/offers/multibuy-three-exact.png';
  multiBuyTwoIcon = 'assets/offers/multibuy-two-exact.png';

  heroStyle = {
      '--lk-offers-left-background': `url("${this.offerLeftBackground}")`,
  };

  remainingSeconds = signal(12 * 60 * 60 + 45 * 60 + 30);
  showAllBundles = signal(false);
  favorites = signal<Set<string>>(new Set());

  countdown = computed(() => {
      const totalSeconds = this.remainingSeconds();
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      return {
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
      };
  });

  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
        this.remainingSeconds.update(value => (value > 0 ? value - 1 : 12 * 60 * 60 + 45 * 60 + 30));
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
        clearInterval(this.timer);
    }
  }

  toggleAllBundles() {
    this.showAllBundles.update(v => !v);
  }

  scrollToOffers() {
    document.getElementById('current-offers')?.scrollIntoView({ behavior: 'smooth' });
  }

  isFavorite(id: string): boolean {
    return this.favorites().has(id);
  }

  toggleFavorite(id: string) {
    const current = new Set(this.favorites());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.favorites.set(current);
  }

  addOfferProduct(product: Product) {
    alert('STOREFRONT.AUTO_STR_114');
  }

  addBundle(bundle: BundleOffer) {
    alert(`ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© ${bundle.title} Ø¨Ø³Ø¹Ø± ${bundle.price} Ø±.Ø³`);
  }

  getVisibleBundles() {
    return this.showAllBundles() ? this.bundleOffers : this.bundleOffers.slice(0, 2);
  }
}
