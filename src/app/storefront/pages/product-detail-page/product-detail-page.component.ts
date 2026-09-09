import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { LucideAngularModule, ChevronLeft, ChevronRight, CircleDollarSign, Flame, Heart, Minus, PackageCheck, Plus, Ruler, ShieldCheck, ShoppingCart, Star, Truck, Zap, Edit3, X } from 'lucide-angular';
import { CartService } from '../../../core/services/cart/cart.service';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { products, Product } from '../../../shared/data/mockData';
import { ProductRepositoryImpl } from '../../../data/repositories/product.repository.impl';
import { ProductFeatureIconComponent } from '../../../shared/components/ui/feature-icon/product-feature-icon.component';
import { LangService } from '../../../core/services/lang/lang.service';
import { ProductReviewsComponent } from '../../components/product/product-reviews/product-reviews.component';

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
        { id: '1', icon: 'Truck', text: 'PRODUCT.SERVICE_FREE_SHIPPING' },
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
  imports: [TranslatePipe, TranslateDirective, CommonModule, FormsModule, RouterLink, StoreLayoutComponent, HomeHeaderComponent, LucideAngularModule, ProductFeatureIconComponent, ProductReviewsComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.css'
})
export class ProductDetailPageComponent {
  pageConfig = signal(initialConfig);
  cartService = inject<any>(CartService);
  favoritesService = inject<any>(FavoritesService);
  toastService = inject<any>(ToastService);
  readonly langService = inject(LangService);
  private productRepo = inject(ProductRepositoryImpl);
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
  readonly EditIcon = Edit3;
  readonly XIcon = X;

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

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      const setProductData = (p: any) => {
        if (!p) return;
        this.product = p;
        const isAr = this.langService.storefrontLang() === 'ar';
        this.display = {
          name: isAr ? (p.nameAr || p.nameEn || p.name) : (p.nameEn || p.nameAr || p.name),
          price: p.price,
          oldPrice: p.originalPrice || p.price,
          rating: p.rating ?? 5,
          reviewCount: p.reviewCount ?? 0,
          categoryLabel: p.category || 'CATEGORIES.SHAPERS',
          description: isAr ? (p.descAr || p.descEn || p.description) : (p.descEn || p.descAr || p.description),
          color: 'STOREFRONT.AUTO_STR_472',
          colors: p.colors && p.colors.length ? p.colors : ['#060606', '#f5d4c2'],
          images: p.images && p.images.length ? p.images : ['/assets/home/product-1.png'],
          discount: p.originalPrice
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0,
        };
      };

      this.productRepo.getProductById(id).subscribe({
        next: (prod) => {
          if (prod) {
            setProductData(prod);
          } else {
            this.productRepo.getProductBySlug(id).subscribe(p => {
              if (p) setProductData(p);
              else setProductData(products.find((x: any) => x.id === id || x.slug === id));
            });
          }
        },
        error: () => setProductData(products.find((x: any) => x.id === id || x.slug === id))
      });
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
