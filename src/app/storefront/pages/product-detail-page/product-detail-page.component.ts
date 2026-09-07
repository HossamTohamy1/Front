import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronLeft, ChevronRight, CircleDollarSign, Flame, Heart, Minus, PackageCheck, Plus, Ruler, ShieldCheck, ShoppingCart, Star, Truck, Zap } from 'lucide-angular';
import { CartService } from '../../../core/services/cart/cart.service';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { products, Product } from '../../../shared/data/mockData';

import { ProductFeatureIconComponent } from '../../../shared/components/ui/feature-icon/product-feature-icon.component';

export interface ProductPageConfig {
    showBreadcrumb: boolean;
    showBestSellerBadge: boolean;
    bestSellerText: string;
    showRatingLine: boolean;
    showColorOptions: boolean;
    colorLabel: string;
    showSizeOptions: boolean;
    sizeLabel: string;
    sizeGuideText: string;
    showPurchaseActions: boolean;
    addToCartText: string;
    buyNowText: string;
    showServiceRow: boolean;
    services: any[];
    showTabs: boolean;
    tabDescriptionText: string;
    tabFeaturesText: string;
    tabReviewsText: string;
    showDescriptionSection: boolean;
    showFeaturesSection: boolean;
    features: any[];
    showReviewsSection: boolean;
}

const initialConfig: ProductPageConfig = {
    showBreadcrumb: true,
    showBestSellerBadge: true,
    bestSellerText: 'HOME.BEST_SELLERS_ALT',
    showRatingLine: true,
    showColorOptions: true,
    colorLabel: 'PRODUCT.COLOR',
    showSizeOptions: true,
    sizeLabel: 'PRODUCT.SIZE',
    sizeGuideText: 'PRODUCT.SIZE_GUIDE',
    showPurchaseActions: true,
    addToCartText: 'PRODUCT.ADD_TO_CART',
    buyNowText: 'PRODUCT.BUY_NOW',
    showServiceRow: true,
    services: [
        { id: '1', icon: 'Truck', text: 'توصيل مجاني للطلبات فوق 300 ر.س' },
        { id: '2', icon: 'RotateCcw', text: 'PRODUCT.SERVICE_EASY_RETURNS' }
    ],
    showTabs: true,
    tabDescriptionText: 'PRODUCT.DESCRIPTION',
    tabFeaturesText: 'PRODUCT.FEATURES',
    tabReviewsText: 'PRODUCT.REVIEWS',
    showDescriptionSection: true,
    showFeaturesSection: true,
    features: [
        { id: '1', icon: 'shield', title: 'PRODUCT.SAFE_MATERIAL', subtitle: 'PRODUCT.GENTLE' },
        { id: '2', icon: 'feather', title: 'PRODUCT.LIGHTWEIGHT', subtitle: 'PRODUCT.COMFORTABLE' },
        { id: '3', icon: 'posture', title: 'PRODUCT.BACK_SUPPORT', subtitle: 'PRODUCT.IMPROVES_POSTURE' },
        { id: '4', icon: 'fabric', title: 'PRODUCT.BREATHABLE', subtitle: 'PRODUCT.AIRFLOW' },
        { id: '5', icon: 'waist', title: 'PRODUCT.WAIST_SCULPTING', subtitle: 'PRODUCT.SHAPES_BODY' }
    ],
    showReviewsSection: true,
};

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule, ProductFeatureIconComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent {
  pageConfig = signal(initialConfig);
  cartService = inject<any>(CartService);
  favoritesService = inject<any>(FavoritesService);
  toastService = inject<any>(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly CircleDollarSign = CircleDollarSign;
  readonly Flame = Flame;
  readonly Heart = Heart;
  readonly Minus = Minus;
  readonly PackageCheck = PackageCheck;
  readonly Plus = Plus;
  readonly Ruler = Ruler;
  readonly ShieldCheck = ShieldCheck;
  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;
  readonly Truck = Truck;
  readonly Zap = Zap;

  product?: Product;
  display: any;
  
  activeImage = signal(0);
  selectedSize = signal('M');
  selectedColor = signal(0);
  quantity = signal(1);
  activeTab = signal('description');

  wishlist = computed(() => this.product ? this.favoritesService.favoriteProductIds().includes(this.product.id) : false);

  ratingRows = [
      { value: 5, count: 198, width: 78 },
      { value: 4, count: 38, width: 21 },
      { value: 3, count: 12, width: 8 },
      { value: 2, count: 5, width: 3 },
      { value: 1, count: 3, width: 2 },
  ];

  customerReviews = [
      {
          name: 'STOREFRONT.AUTO_STR_407',
          meta: 'تم الشراء: مقاس L - بيج',
          comment: 'يعطي شكل جميل تحت الملابس ❤️',
      },
      {
          name: 'DASHBOARD.AUTO_STR_368',
          meta: 'تم الشراء: مقاس M - أسود',
          comment: 'STOREFRONT.AUTO_STR_44',
      },
  ];

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.product = products.find((p: any) => p.id === id);
      if (this.product) {
        this.display = {
            name: this.product.nameAr,
            price: this.product.price,
            oldPrice: this.product.originalPrice || this.product.price,
            rating: this.product.rating,
            reviewCount: this.product.reviewCount,
            categoryLabel: 'CATEGORIES.SHAPERS',
            description: this.product.descAr,
            color: 'STOREFRONT.AUTO_STR_472',
            colors: ['#060606', '#f5d4c2'],
            images: this.product.images,
            discount: this.product.originalPrice
                ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
                : 0,
        };
      }
    });
  }

  get cartProduct() {
    if (!this.product || !this.display) return null;
    return {
        ...this.product,
        nameAr: this.display.name,
        price: this.display.price,
        originalPrice: this.display.oldPrice,
        images: this.display.images,
        rating: this.display.rating,
        reviewCount: this.display.reviewCount,
        descAr: this.display.description,
    } as Product;
  }

  selectImage(index: number) {
      this.activeImage.set(index);
  }

  previousImage() {
      this.activeImage.update(current => (current - 1 + this.display.images.length) % this.display.images.length);
  }

  nextImage() {
      this.activeImage.update(current => (current + 1) % this.display.images.length);
  }

  addCurrentProduct() {
      if (!this.cartProduct) return;
      this.cartService.addToCart(this.cartProduct, this.selectedSize(), this.quantity());
      this.toastService.showToast('STOREFRONT.AUTO_STR_114');
  }

  buyNow() {
      this.addCurrentProduct();
      this.router.navigate(['/checkout']);
  }

  scrollToSection(sectionId: string) {
      this.activeTab.set(sectionId);
      document.getElementById(`lk-${sectionId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleCurrentFavorite() {
      if (!this.product) return;
      this.favoritesService.toggleFavorite(this.product.id);
      this.toastService.showToast(this.wishlist() ? 'STOREFRONT.AUTO_STR_127' : 'STOREFRONT.AUTO_STR_100', 'info');
  }

  getFiveStars() {
      return Array(5).fill(0);
  }
}
