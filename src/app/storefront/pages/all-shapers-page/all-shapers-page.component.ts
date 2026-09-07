import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronDown, ChevronLeft, ChevronRight, Droplets, Flame, Grid2X2, Heart, Layers3, List, Ruler, ShoppingCart, Star, Tag, X } from 'lucide-angular';
import { CartService } from '../../../core/services/cart/cart.service';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { products, Product } from '../../../shared/data/mockData';

import {
  ProductColor,
  ProductType,
  PriceFilter,
  SortMode,
  ViewMode,
  FilterName,
  ALL_SHAPERS_CATALOG_ITEMS,
} from '../../../data/mock/all-shapers.mock';

const catalogItems = ALL_SHAPERS_CATALOG_ITEMS;

const productTypeOptions: Array<{ value: ProductType | 'all'; label: string }> = [
  { value: 'all', label: 'STOREFRONT.AUTO_STR_381' },
  { value: 'waist', label: 'COMMON.WAISTTRAINERS' },
  { value: 'postpartum', label: 'SHARED.AUTO_STR_68' },
  { value: 'full-body', label: 'STOREFRONT.AUTO_STR_382' },
  { value: 'sport', label: 'SHARED.AUTO_STR_99' },
  { value: 'men', label: 'COMMON.MENS' },
  { value: 'women', label: 'COMMON.WOMENS' },
];

const priceOptions: Array<{ value: PriceFilter; label: string }> = [
  { value: 'all', label: 'STOREFRONT.AUTO_STR_383' },
  { value: 'under-210', label: 'أقل من 210 ر.س' },
  { value: '210-240', label: 'من 210 إلى 240 ر.س' },
  { value: 'over-240', label: 'أكثر من 240 ر.س' },
];

const colorOptions: Array<{ value: ProductColor | 'all'; label: string }> = [
  { value: 'all', label: 'STOREFRONT.AUTO_STR_384' },
  { value: 'black', label: 'STOREFRONT.AUTO_STR_472' },
  { value: 'beige', label: 'STOREFRONT.AUTO_STR_483' },
];

const sizeOptions = ['all', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const PAGE_SIZE = 12;

function isProductType(value: string | null): value is ProductType {
  return productTypeOptions.some(option => option.value !== 'all' && option.value === value);
}

function matchesPrice(price: number, filter: PriceFilter) {
  if (filter === 'under-210') return price < 210;
  if (filter === '210-240') return price >= 210 && price <= 240;
  if (filter === 'over-240') return price > 240;
  return true;
}

export interface AllShapersPageConfig {
    headerTitle: string;
    showRating: boolean;
    showReviewsCount: boolean;
    showOriginalPrice: boolean;
    emptyTitle: string;
    emptyText: string;
    emptyCta: string;
}

const initialConfig: AllShapersPageConfig = {
    headerTitle: 'PRODUCTS.ALL_SHAPERS',
    showRating: true,
    showReviewsCount: true,
    showOriginalPrice: true,
    emptyTitle: 'PRODUCTS.NO_PRODUCTS',
    emptyText: 'جرّبي تغيير اللون أو المقاس أو نطاق السعر.',
    emptyCta: 'PRODUCTS.VIEW_ALL'
};

@Component({
  selector: 'app-all-shapers-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule],
  templateUrl: './all-shapers-page.component.html',
  styleUrl: './all-shapers-page.component.css'
})
export class AllShapersPageComponent implements OnInit {
  cartService = inject(CartService);
  favoritesService = inject(FavoritesService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  readonly ChevronDown = ChevronDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Droplets = Droplets;
  readonly Flame = Flame;
  readonly Grid2X2 = Grid2X2;
  readonly Heart = Heart;
  readonly Layers3 = Layers3;
  readonly List = List;
  readonly Ruler = Ruler;
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;
  readonly Tag = Tag;
  readonly X = X;

  pageConfig = signal(initialConfig);

  productTypeOptions = productTypeOptions;
  priceOptions = priceOptions;
  colorOptions = colorOptions;
  sizeOptions = sizeOptions;

  activeFilter = signal<FilterName>(null);
  selectedType = signal<ProductType | 'all'>('all');
  selectedPrice = signal<PriceFilter>('all');
  selectedColor = signal<ProductColor | 'all'>('all');
  selectedSize = signal('all');
  sortMode = signal<SortMode>('bestseller');
  viewMode = signal<ViewMode>('grid');
  currentPage = signal(1);
  showAllProducts = signal(false);

  newSortIcon = '/assets/icons/new-sort-icon.png';

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const typeFromRoute = params.get('type');
      const routeType: ProductType | 'all' = isProductType(typeFromRoute) ? (typeFromRoute as ProductType) : 'all';
      if (this.selectedType() !== routeType) {
        this.selectedType.set(routeType);
      }
    });
  }

  filteredItems = computed(() => {
    const result = catalogItems.filter(item => {
      const typeMatches = this.selectedType() === 'all' || item.type === this.selectedType();
      const colorMatches = this.selectedColor() === 'all' || item.color === this.selectedColor();
      const sizeMatches = this.selectedSize() === 'all' || item.sizes.includes(this.selectedSize());
      return typeMatches && colorMatches && sizeMatches && matchesPrice(item.price, this.selectedPrice());
    });
    return [...result].sort((a, b) => this.sortMode() === 'bestseller' ? a.bestsellerRank - b.bestsellerRank : a.latestRank - b.latestRank);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.filteredItems().length / PAGE_SIZE)));
  
  visibleItems = computed(() => {
    if (this.showAllProducts()) return this.filteredItems();
    const startIndex = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filteredItems().slice(startIndex, startIndex + PAGE_SIZE);
  });

  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  hasActiveFilters = computed(() => this.selectedType() !== 'all' || this.selectedPrice() !== 'all' || this.selectedColor() !== 'all' || this.selectedSize() !== 'all');

  toggleFilter(filterName: Exclude<FilterName, null>) {
    this.activeFilter.update(current => current === filterName ? null : filterName);
  }

  addCatalogItemToCart(item: any) {
    const baseProduct = products.find((p: any) => p.id === item.productId) ?? products[0];
    const cartProduct: Product = {
      ...baseProduct,
      nameAr: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      images: [item.image],
      sizes: item.sizes,
    };
    const defaultSize = item.sizes[Math.floor(item.sizes.length / 2)] ?? 'M';
    this.cartService.addToCart(cartProduct, defaultSize);
    this.toastService.showToast('STOREFRONT.AUTO_STR_77');
  }

  applyTypeFilter(type: ProductType | 'all') {
    this.selectedType.set(type);
    const queryParams: any = {};
    if (type !== 'all') queryParams.type = type;
    this.router.navigate([], { queryParams, queryParamsHandling: '' });
    this.activeFilter.set(null);
  }

  resetFilters() {
    this.selectedType.set('all');
    this.router.navigate([], { queryParams: {}, queryParamsHandling: '' });
    this.selectedPrice.set('all');
    this.selectedColor.set('all');
    this.selectedSize.set('all');
    this.activeFilter.set(null);
  }

  isFavorite(productId: string) {
    return this.favoritesService.favoriteProductIds().includes(productId);
  }

  toggleFavorite(productId: string, isFav: boolean) {
    this.favoritesService.toggleFavorite(productId);
    this.toastService.showToast(isFav ? 'STOREFRONT.AUTO_STR_127' : 'STOREFRONT.AUTO_STR_100', 'info');
  }

  getTypeLabel(value: string) {
    return this.productTypeOptions.find(o => o.value === value)?.label || '';
  }

  getPriceLabel(value: string) {
    return this.priceOptions.find(o => o.value === value)?.label || '';
  }

  getColorLabel(value: string) {
    return this.colorOptions.find(o => o.value === value)?.label || '';
  }

  getFiveStars() {
    return Array(5).fill(0);
  }
}
