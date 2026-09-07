import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, EventEmitter, Output, HostListener, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { 
  LucideAngularModule, 
  Menu, 
  Search, 
  ShoppingCart, 
  ArrowLeft, 
  ChevronLeft, 
  Home, 
  Grid2x2, 
  ShoppingBag, 
  Heart, 
  Ruler, 
  PackageSearch, 
  CircleHelp, 
  ShieldCheck, 
  FileText, 
  UserRound 
} from 'lucide-angular';
import { StaffDashboardMenuItemComponent } from '../../../../storefront/components/auth/staff-dashboard-menu-item.component';
import { CartService } from '../../../../core/services/cart/cart.service';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, CommonModule, RouterLink, LucideAngularModule, StaffDashboardMenuItemComponent],
  template: `
    <header class="lk-home-header" aria-label='SHARED.AUTO_STR_49'>
      <div class="lk-home-header__inner">
        <div class="lk-home-header__tools">
          <button
            type="button"
            class="lk-icon-button"
            (click)="openMenu()"
            aria-label='DASHBOARD.AUTO_STR_301'
          >
            <lucide-icon [img]="MenuIcon" [size]="27" [strokeWidth]="1.8" aria-hidden="true"></lucide-icon>
          </button>

          <button
            type="button"
            class="lk-icon-button"
            (click)="navigateToSearch()"
            aria-label='SHARED.AUTO_STR_98'
          >
            <lucide-icon [img]="SearchIcon" [size]="29" [strokeWidth]="1.8" aria-hidden="true"></lucide-icon>
          </button>
        </div>

        <a
          routerLink="/"
          class="lk-home-header__logo"
          aria-label='SHARED.AUTO_STR_28'
        >
          <img
            src="assets/home/logo-header.png"
            alt='SHARED.AUTO_STR_72'
            width="1758"
            height="784"
          />
        </a>

        <a
          routerLink="/cart"
          class="lk-home-header__cart"
          aria-label='CART.TITLE'
        >
          <lucide-icon
            [img]="ShoppingCartIcon"
            [size]="29"
            [strokeWidth]="1.7"
            aria-hidden="true"
          ></lucide-icon>

          @if (cartService.cartCount() > 0) {
            <span>{{ cartService.cartCount() > 9 ? '9+' : cartService.cartCount() }}</span>
          }
        </a>
      </div>
    </header>

    @if (menuOpen) {
      <div
        class="lk-more-drawer-overlay"
        role="presentation"
        (mousedown)="onOverlayMouseDown($event)"
      >
        <aside
          class="lk-more-drawer"
          role="dialog"
          aria-modal="true"
          aria-label='SHARED.AUTO_STR_62'
        >
          <header class="lk-more-drawer__header">
            <button
              type="button"
              (click)="closeMenu()"
              aria-label='DASHBOARD.AUTO_STR_221'
            >
              <lucide-icon [img]="ArrowLeftIcon" aria-hidden="true"></lucide-icon>
            </button>

            <h2>{{ 'SHARED.AUTO_STR_84' | translate }}</h2>

            <span aria-hidden="true"></span>
          </header>

          <div class="lk-more-drawer__body">
            <nav
              class="lk-more-drawer__list"
              aria-label='SHARED.AUTO_STR_63'
            >
              @for (item of shoppingMenuItems; track item.to) {
                <a
                  [routerLink]="item.to"
                  class="lk-more-menu-card"
                  (click)="closeMenu()"
                >
                  <span
                    class="lk-more-menu-card__icon"
                    aria-hidden="true"
                  >
                    <lucide-icon [img]="item.icon"></lucide-icon>
                  </span>

                  <span class="lk-more-menu-card__copy">
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.description }}</small>
                  </span>

                  <lucide-icon
                    [img]="ChevronLeftIcon"
                    class="lk-more-menu-card__chevron"
                    aria-hidden="true"
                  ></lucide-icon>
                </a>
              }

              <app-staff-dashboard-menu-item (onNavigate)="closeMenu()"></app-staff-dashboard-menu-item>
            </nav>

            <div class="lk-more-drawer__separator"></div>

            <nav
              class="lk-more-drawer__list"
              aria-label='SHARED.AUTO_STR_29'
            >
              @for (item of helpMenuItems; track item.to) {
                <a
                  [routerLink]="item.to"
                  class="lk-more-menu-card"
                  (click)="closeMenu()"
                >
                  <span
                    class="lk-more-menu-card__icon"
                    aria-hidden="true"
                  >
                    <lucide-icon [img]="item.icon"></lucide-icon>
                  </span>

                  <span class="lk-more-menu-card__copy">
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.description }}</small>
                  </span>

                  <lucide-icon
                    [img]="ChevronLeftIcon"
                    class="lk-more-menu-card__chevron"
                    aria-hidden="true"
                  ></lucide-icon>
                </a>
              }
            </nav>
          </div>
        </aside>
      </div>
    }
  `
})
export class HomeHeaderComponent {
  @Output() onOpenMenu = new EventEmitter<void>();

  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  cartService = inject(CartService);
  menuOpen = false;

  readonly MenuIcon = Menu;
  readonly SearchIcon = Search;
  readonly ShoppingCartIcon = ShoppingCart;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly ChevronLeftIcon = ChevronLeft;

  shoppingMenuItems = [
    { to: '/', title: 'COMMON.HOME', description: 'SHARED.AUTO_STR_12', icon: Home },
    { to: '/categories', title: 'CATEGORIES.TITLE', description: 'SHARED.AUTO_STR_19', icon: Grid2x2 },
    { to: '/all-shapers', title: 'PRODUCTS.ALL_SHAPERS', description: 'SHARED.AUTO_STR_8', icon: ShoppingBag },
    { to: '/favorites', title: 'FAVORITES.TITLE', description: 'SHARED.AUTO_STR_16', icon: Heart },
    { to: '/cart', title: 'CART.TITLE', description: 'SHARED.AUTO_STR_17', icon: ShoppingCart },
    { to: '/size-guide', title: 'PRODUCT.SIZE_GUIDE', description: 'SHARED.AUTO_STR_9', icon: Ruler },
  ];

  helpMenuItems = [
    { to: '/orders', title: 'ORDERS.TRACK', description: 'SHARED.AUTO_STR_13', icon: PackageSearch },
    { to: '/faq', title: 'FAQ.TITLE', description: 'SHARED.AUTO_STR_10', icon: CircleHelp },
    { to: '/policies', title: 'POLICIES.TITLE', description: 'SHARED.AUTO_STR_3', icon: ShieldCheck },
    { to: '/about', title: 'ABOUT.TITLE', description: 'SHARED.AUTO_STR_14', icon: FileText },
    { to: '/profile', title: 'PROFILE.TITLE', description: 'SHARED.AUTO_STR_21', icon: UserRound },
  ];

  @HostListener('window:keydown.escape', ['$event'])
  handleEscape() {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  openMenu() {
    if (this.onOpenMenu.observed) {
      this.onOpenMenu.emit();
      return;
    }
    
    this.menuOpen = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeMenu() {
    this.menuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  onOverlayMouseDown(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeMenu();
    }
  }
}
