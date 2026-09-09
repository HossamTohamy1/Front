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
import { CartService } from '../../../core/services/cart/cart.service';
import { ToastService } from '../../../core/services/toast/toast.service';

import { FavoritesPageConfigService } from '../../../core/services/page-configs/favorites-page-config.service';

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
  nameAr: string;
  nameEn: string;
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
import { LocalizeFieldPipe } from '../../../shared/pipes/localize-field.pipe';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, FormsModule, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule, LocalizeFieldPipe],
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
  private configService = inject(FavoritesPageConfigService);
  pageConfig = this.configService.pageConfig;

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

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  removeFavorite(id: string) {
    this.favoriteProductIds.update(ids => ids.filter(i => i !== id));
  }

  addToCart(product: Product, size: string) {
    this.cartService.addToCart(product as any, size, 1);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    this.toastService.showToast(message, type);
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
        nameAr: homeProduct?.nameAr ?? product.nameAr,
        price: homeProduct?.price ?? Math.round(product.price),
        originalPrice: homeProduct?.oldPrice ?? product.originalPrice,
        images: homeProduct?.image ? [homeProduct.image] : product.images,
      },
      nameAr: homeProduct?.nameAr ?? product.nameAr,
      nameEn: homeProduct?.nameEn ?? product.nameAr, // product mock doesn't have nameEn
      image: homeProduct?.image ?? product.images[0],
      price: homeProduct?.price ?? Math.round(product.price),
      oldPrice: homeProduct?.oldPrice ?? (product.originalPrice ? Math.round(product.originalPrice) : undefined),
      color: isBeige ? 'STOREFRONT.AUTO_STR_483' : 'STOREFRONT.AUTO_STR_472',
      size: defaultSize,
    };
  }
}
