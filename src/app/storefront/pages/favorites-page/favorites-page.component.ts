import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Heart, RotateCcw, ShieldCheck, ShoppingCart, Trash2, Truck } from 'lucide-angular';
import { sanitizeWithInitial } from '../../../core/utils/config-sanitizer';
import { LangService } from '../../../core/services/lang/lang.service';

export interface TrustBadgeConfig {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
}

export interface FavoritesPageConfig {
    showTitle: boolean;
    headerTitle: string;
    headerSubtitle: string;
    
    showAddAllToCart: boolean;
    addAllToCartText: string;
    
    showToolbar: boolean;
    showSort: boolean;
    showCount: boolean;
    
    showProductColor: boolean;
    showProductSize: boolean;
    showProductPrice: boolean;
    showProductOldPrice: boolean;
    showProductStock: boolean;
    showRemoveAction: boolean;
    showMoveToCartAction: boolean;
    
    emptyStateTitle: string;
    emptyStateSubtitle: string;
    emptyStateButtonText: string;
    showEmptyStateIllustration: boolean;
    
    showTrustBadges: boolean;
    trustBadges: TrustBadgeConfig[];
}

const initialConfig: FavoritesPageConfig = {
    showTitle: true,
    headerTitle: 'FAVORITES.TITLE',
    headerSubtitle: 'FAVORITES.SUBTITLE',
    
    showAddAllToCart: true,
    addAllToCartText: 'FAVORITES.ADD_ALL',
    
    showToolbar: true,
    showSort: true,
    showCount: true,
    
    showProductColor: true,
    showProductSize: true,
    showProductPrice: true,
    showProductOldPrice: true,
    showProductStock: true,
    showRemoveAction: true,
    showMoveToCartAction: true,
    
    emptyStateTitle: 'FAVORITES.EMPTY',
    emptyStateSubtitle: 'FAVORITES.EMPTY_DESC',
    emptyStateButtonText: 'COMMON.START_SHOPPING',
    showEmptyStateIllustration: true,
    
    showTrustBadges: true,
    trustBadges: [
        { id: '1', icon: 'BadgeCheck', title: 'CART.ORIGINAL_PRODUCTS', subtitle: 'CART.GUARANTEED_100' },
        { id: '2', icon: 'Truck', title: 'CART.FAST_SHIPPING', subtitle: 'CART.DAYS_2_5' },
        { id: '3', icon: 'RotateCcw', title: 'CART.EASY_RETURNS', subtitle: 'CART.RETURN_PERIOD' },
        { id: '4', icon: 'ShieldCheck', title: 'CART.SECURE_PAYMENT', subtitle: 'CART.SECURE_100' }
    ]
};

export interface Product {
  id: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  category: string;
  stock: number;
}

export type SortMode = 'latest' | 'price-low' | 'price-high';

export type FavoriteProductDisplay = {
  product: Product;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  color: string;
  size: string;
}

const dummyProducts: Product[] = [
  { id: 'prod-1', nameAr: 'STOREFRONT.AUTO_STR_229', price: 299, originalPrice: 350, images: ['/assets/categories/category-women-reference.png'], sizes: ['S', 'M', 'L'], category: 'general', stock: 10 },
  { id: 'prod-2', nameAr: 'STOREFRONT.AUTO_STR_423', price: 150, images: ['/assets/categories/category-waist-reference.png'], sizes: ['M', 'L'], category: 'postpartum', stock: 0 },
];
const homeProducts: any[] = [];
const homeProductById = new Map(homeProducts.map(item => [item.productId, item]));

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, FormsModule, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css'
})
export class FavoritesPageComponent implements OnInit, OnDestroy {
  readonly BadgeCheck = BadgeCheck;
  readonly ChevronDown = ChevronDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Heart = Heart;
  readonly RotateCcw = RotateCcw;
  readonly ShieldCheck = ShieldCheck;
  readonly ShoppingCart = ShoppingCart;
  readonly Trash2 = Trash2;
  readonly Truck = Truck;

  public langService = inject(LangService);
  pageConfig = signal<FavoritesPageConfig>(initialConfig);

  favoriteProductIds = signal<string[]>(['prod-1', 'prod-2']); // Initial dummy data
  sortMode = signal<SortMode>('latest');
  
  favoriteProducts = computed(() => {
    const favoriteOrder = new Map(this.favoriteProductIds().map((productId, index) => [productId, index]));
    const resolved = this.favoriteProductIds()
      .map(productId => dummyProducts.find(product => product.id === productId))
      .filter((product): product is Product => Boolean(product))
      .map(p => this.resolveFavoriteProduct(p));

    return resolved.sort((first, second) => {
      if (this.sortMode() === 'price-low') return first.price - second.price;
      if (this.sortMode() === 'price-high') return second.price - first.price;
      return (favoriteOrder.get(second.product.id) ?? 0) - (favoriteOrder.get(first.product.id) ?? 0);
    });
  });

  private storageListener = (e: StorageEvent) => {
    if (e.key === 'loxxking-favorites-page-config' && e.newValue) {
      try {
        const clean = sanitizeWithInitial(JSON.parse(e.newValue), initialConfig);
        this.pageConfig.set(clean);
      } catch (_) {}
    }
  };

  ngOnInit() {
    const saved = localStorage.getItem('loxxking-favorites-page-config');
    if (saved) {
      try {
        const clean = sanitizeWithInitial(JSON.parse(saved), initialConfig);
        this.pageConfig.set(clean);
        localStorage.setItem('loxxking-favorites-page-config', JSON.stringify(clean));
      } catch (e) {}
    }
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    window.removeEventListener('storage', this.storageListener);
  }

  removeFavorite(id: string) {
    this.favoriteProductIds.update(ids => ids.filter(i => i !== id));
  }

  addToCart(product: Product, size: string) {
    console.log('Added to cart:', product, size);
  }

  showToast(message: string, type: string = 'success') {
    alert(message);
  }

  addFavoriteToCart(item: FavoriteProductDisplay, removeAfterAdding: boolean) {
    this.addToCart(item.product, item.size);
    if (removeAfterAdding) this.removeFavorite(item.product.id);
    this.showToast(removeAfterAdding ? 'STOREFRONT.AUTO_STR_143' : 'STOREFRONT.AUTO_STR_114');
  }

  addAllFavoritesToCart() {
    this.favoriteProducts().forEach(item => this.addToCart(item.product, item.size));
    this.showToast('STOREFRONT.AUTO_STR_73');
  }

  updateSortMode(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortMode.set(target.value as SortMode);
  }

  private resolveFavoriteProduct(product: Product): FavoriteProductDisplay {
    const homeProduct = homeProductById.get(product.id);
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)] ?? product.sizes[0] ?? 'M';
    const isBeige = product.category === 'postpartum' || product.id === 'prod-3' || product.id === 'prod-6';

    return {
      product: {
        ...product,
        nameAr: homeProduct?.name ?? product.nameAr,
        price: homeProduct?.price ?? Math.round(product.price),
        originalPrice: homeProduct?.oldPrice ?? product.originalPrice,
        images: homeProduct?.image ? [homeProduct.image] : product.images,
      },
      name: homeProduct?.name ?? product.nameAr,
      image: homeProduct?.image ?? product.images[0],
      price: homeProduct?.price ?? Math.round(product.price),
      oldPrice: homeProduct?.oldPrice ?? (product.originalPrice ? Math.round(product.originalPrice) : undefined),
      color: isBeige ? 'STOREFRONT.AUTO_STR_483' : 'STOREFRONT.AUTO_STR_472',
      size: defaultSize,
    };
  }
}
