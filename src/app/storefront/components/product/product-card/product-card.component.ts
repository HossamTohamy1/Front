import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Star, Heart } from 'lucide-angular';
import { Product } from '../../../../shared/data/mockData';
import { LangService } from '../../../../core/services/lang/lang.service';
import { CartService } from '../../../../core/services/cart/cart.service';
import { FavoritesService } from '../../../../core/services/favorites/favorites.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { t } from '../../../../shared/i18n/translations';
import { BadgeComponent } from '../../../../shared/components/ui/badge/badge.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, LucideAngularModule, BadgeComponent],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Input() compact = false;

  langService = inject(LangService);
  cartService = inject(CartService);
  favoritesService = inject(FavoritesService);
  toastService = inject(ToastService);

  readonly ShoppingCart = ShoppingCart;
  readonly Star = Star;
  readonly Heart = Heart;

  imgLoaded = signal(false);

  lang = this.langService.lang;
  favorite = computed(() => this.favoritesService.favoriteProductIds().includes(this.product.id));

  get name() {
    return this.lang() === 'ar' ? this.product.nameAr : this.product.nameEn;
  }

  get discount() {
    return this.product.originalPrice
      ? Math.round(((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100)
      : 0;
  }

  get tDiscount() {
    return t('discount', this.lang());
  }

  get isNewText() {
    return this.lang() === 'ar' ? 'جديد' : 'New';
  }

  get categoryFormatted() {
    return this.product.category.replace(/-/g, ' ');
  }

  handleQuickAdd(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = this.product.sizes[Math.floor(this.product.sizes.length / 2)];
    this.cartService.addToCart(this.product, defaultSize);
    this.toastService.showToast('STOREFRONT.AUTO_STR_114');
  }

  handleFavorite(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.favoritesService.toggleFavorite(this.product.id);
    this.toastService.showToast(
      this.favorite() ? 'STOREFRONT.AUTO_STR_127' : 'STOREFRONT.AUTO_STR_100',
      'info'
    );
  }
}
