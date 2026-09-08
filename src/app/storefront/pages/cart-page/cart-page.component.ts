import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  LucideAngularModule, 
  BadgeCheck, 
  ChevronLeft, 
  Heart, 
  LockKeyhole, 
  RotateCcw, 
  ShieldCheck, 
  ShoppingCart, 
  Tag, 
  Trash2, 
  Truck 
} from 'lucide-angular';

import { StoreLayoutComponent } from '../../../shared/components/layout/store-layout/store-layout.component';
import { HomeHeaderComponent } from '../../../shared/components/layout/home-header/home-header.component';
import { CartService, CartItem } from '../../../core/services/cart/cart.service';
import { FavoritesService } from '../../../core/services/favorites/favorites.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { CartPageConfigService } from '../../../core/services/config/cart-page-config.service';
import { products } from '../../../shared/data/mockData';

type CartDisplayItem = {
  cartItem: CartItem;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  color: string;
  favorite?: boolean;
};

const productsById = new Map(products.map(p => [p.id, p]));

function resolveCartItem(cartItem: CartItem): CartDisplayItem {
  const homeProduct = productsById.get(cartItem.product.id);
  const isBeige =
    cartItem.product.category === 'postpartum' ||
    cartItem.product.id === 'prod-3' ||
    cartItem.product.id === 'prod-6';

  return {
    cartItem,
    name: homeProduct?.nameAr ?? cartItem.product.nameAr,
    image: homeProduct?.images[0] ?? cartItem.product.images[0],
    price: homeProduct?.price ?? Math.round(cartItem.product.price),
    oldPrice:
      homeProduct?.originalPrice ??
      (cartItem.product.originalPrice ? Math.round(cartItem.product.originalPrice) : undefined),
    color: isBeige ? 'STOREFRONT.AUTO_STR_483' : 'STOREFRONT.AUTO_STR_472',
  };
}

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    RouterLink,
    LucideAngularModule,
    StoreLayoutComponent,
    HomeHeaderComponent
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {
  private cartService = inject(CartService);
  private favoritesService = inject(FavoritesService);
  private toastService = inject(ToastService);
  private configService = inject(CartPageConfigService);
  private router = inject(Router);

  config = this.configService.config;
  cart = this.cartService.cart;

  couponCode = signal('');
  appliedCoupon = signal<string | null>(null);

  displayItems = computed(() => {
    return this.cart().map(item => {
      const resolved = resolveCartItem(item);
      return {
        ...resolved,
        favorite: this.isFavorite(item.product.id)
      };
    });
  });

  subtotal = computed(() => 
    this.displayItems().reduce((sum, item) => sum + item.price * item.cartItem.quantity, 0)
  );
  
  shipping = computed(() => this.displayItems().length > 0 ? 20 : 0);
  
  discount = computed(() => 
    this.appliedCoupon() === 'LOXX10' ? Math.round(this.subtotal() * 0.1) : 0
  );
  
  total = computed(() => 
    Math.max(0, this.subtotal() + this.shipping() - this.discount())
  );
  
  itemCount = computed(() => 
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );

  constructor() {
    LucideAngularModule;
  }

  updateQuantity(productId: string, size: string, quantity: number) {
    this.cartService.updateQuantity(productId, size, quantity);
  }

  removeFromCart(productId: string, size: string) {
    this.cartService.removeFromCart(productId, size);
    this.toastService.showToast('STOREFRONT.AUTO_STR_150', 'info');
  }

  isFavorite(productId: string): boolean {
    return this.favoritesService.isFavorite(productId);
  }

  toggleFavorite(productId: string, favorite: boolean) {
    this.favoritesService.toggleFavorite(productId);
    this.toastService.showToast(favorite ? 'STOREFRONT.AUTO_STR_127' : 'STOREFRONT.AUTO_STR_100', 'info');
  }

  setCouponCode(event: Event) {
    const input = event.target as HTMLInputElement;
    this.couponCode.set(input.value);
  }

  applyCoupon() {
    const normalizedCode = this.couponCode().trim().toUpperCase();

    if (!normalizedCode) {
      this.toastService.showToast('STOREFRONT.AUTO_STR_160', 'info');
      return;
    }

    if (normalizedCode === 'LOXX10') {
      this.appliedCoupon.set(normalizedCode);
      this.toastService.showToast('STOREFRONT.AUTO_STR_128', 'success');
      return;
    }

    this.appliedCoupon.set(null);
    this.toastService.showToast('STOREFRONT.AUTO_STR_197', 'error');
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
