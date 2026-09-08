import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Tags, PackageSearch, Home, Heart, User } from 'lucide-angular';
import { CartService } from '../../../../core/services/cart/cart.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="lk-mobile-nav" [attr.aria-label]="'SHARED.AUTO_STR_52' | translate">
      <div class="lk-mobile-nav__inner">
        @for (item of navigationItems; track item.to) {
          <a
            [routerLink]="item.to"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{exact: item.to === '/'}"
            [attr.aria-current]="isActive(item.to) ? 'page' : null"
          >
            <span class="lk-mobile-nav__icon">
              <lucide-icon
                [img]="item.icon"
                [size]="22"
                [strokeWidth]="isActive(item.to) ? 2.5 : 1.8"
                [class.fill-current]="isActive(item.to) && item.icon === HomeIcon"
                aria-hidden="true"
              ></lucide-icon>

              @if (item.hasBadge && cartService.cartCount() > 0) {
                <span class="lk-mobile-nav__badge">
                  {{ cartService.cartCount() > 9 ? '9+' : cartService.cartCount() }}
                </span>
              }
            </span>

            <span>{{ item.label | translate }}</span>
          </a>
        }
      </div>
    </nav>
  `,
  host: {
    style: 'display: block;'
  }
})
export class BottomNavComponent {
  private router = inject(Router);
  cartService = inject(CartService);

  readonly HomeIcon = Home;

  navigationItems = [
    { to: '/cart', icon: ShoppingCart, label: 'COMMON.CART', hasBadge: true },
    { to: '/offers', icon: Tags, label: 'COMMON.OFFERS' },
    { to: '/orders', icon: PackageSearch, label: 'ORDERS.TRACK' },
    { to: '/', icon: Home, label: 'COMMON.HOME' },
    { to: '/favorites', icon: Heart, label: 'FAVORITES.TITLE' },
    { to: '/profile', icon: User, label: 'PROFILE.TITLE' }
  ];

  isActive(path: string): boolean {
    const current = this.router.url;
    if (path === '/') {
      return current === '/';
    }
    return current.startsWith(path);
  }
}
