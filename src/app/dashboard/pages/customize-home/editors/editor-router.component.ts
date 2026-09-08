import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageEditorComponent } from './home-page-editor.component';
import { AboutPageEditorComponent } from './about-page-editor.component';
import { AllShapersPageEditorComponent } from './all-shapers-page-editor.component';
import { CartPageEditorComponent } from './cart-page-editor.component';
import { CategoriesPageEditorComponent } from './categories-page-editor.component';
import { CategoryPageEditorComponent } from './category-page-editor.component';
import { CheckoutPageEditorComponent } from './checkout-page-editor.component';
import { ContactPageEditorComponent } from './contact-page-editor.component';
import { FaqPageEditorComponent } from './faq-page-editor.component';
import { FavoritesPageEditorComponent } from './favorites-page-editor.component';
import { LoginPageEditorComponent } from './login-page-editor.component';
import { MyOrdersPageEditorComponent } from './my-orders-page-editor.component';
import { NotificationsPageEditorComponent } from './notifications-page-editor/notifications-page-editor.component';
import { OffersPageEditorComponent } from './offers-page-editor/offers-page-editor.component';
import { OrderConfirmationPageEditorComponent } from './order-confirmation-page-editor/order-confirmation-page-editor.component';
import { PoliciesPageEditorComponent } from './policies-page-editor/policies-page-editor.component';
import { ProductPageEditorComponent } from './product-page-editor.component';
import { ProfilePageEditorComponent } from './profile-page-editor.component';
import { SearchPageEditorComponent } from './search-page-editor.component';
import { SizeGuidePageEditorComponent } from './size-guide-page-editor.component';

@Component({
  selector: 'app-editor-router',
  standalone: true,
  imports: [TranslatePipe, TranslateDirective, 
    CommonModule,
    HomePageEditorComponent,
    AboutPageEditorComponent,
    AllShapersPageEditorComponent,
    CartPageEditorComponent,
    CategoriesPageEditorComponent,
    CategoryPageEditorComponent,
    CheckoutPageEditorComponent,
    ContactPageEditorComponent,
    FaqPageEditorComponent,
    FavoritesPageEditorComponent,
    LoginPageEditorComponent,
    MyOrdersPageEditorComponent,
    NotificationsPageEditorComponent,
    OffersPageEditorComponent,
    OrderConfirmationPageEditorComponent,
    PoliciesPageEditorComponent,
    ProductPageEditorComponent,
    ProfilePageEditorComponent,
    SearchPageEditorComponent,
    SizeGuidePageEditorComponent
  ],
  template: `
    <div
      class="w-full h-full transition-all duration-150 ease-in-out"
      [class.opacity-0]="isTransitioning"
      [class.translate-y-2]="isTransitioning"
      [class.opacity-100]="!isTransitioning"
      [class.translate-y-0]="!isTransitioning"
    >
      @switch (editorKey) {
        @case ('home') { <app-home-page-editor></app-home-page-editor> }
        @case ('about') { <app-about-page-editor></app-about-page-editor> }
        @case ('allshapers') { <app-all-shapers-page-editor></app-all-shapers-page-editor> }
        @case ('cart') { <app-cart-page-editor></app-cart-page-editor> }
        @case ('categories') { <app-categories-page-editor></app-categories-page-editor> }
        @case ('category') { <app-category-page-editor></app-category-page-editor> }
        @case ('checkout') { <app-checkout-page-editor></app-checkout-page-editor> }
        @case ('contact') { <app-contact-page-editor></app-contact-page-editor> }
        @case ('faq') { <app-faq-page-editor></app-faq-page-editor> }
        @case ('favorites') { <app-favorites-page-editor></app-favorites-page-editor> }
        @case ('login') { <app-login-page-editor></app-login-page-editor> }
        @case ('myorders') { <app-my-orders-page-editor></app-my-orders-page-editor> }
        @case ('notifications') { <app-notifications-page-editor></app-notifications-page-editor> }
        @case ('offers') { <app-offers-page-editor></app-offers-page-editor> }
        @case ('orderconfirmation') { <app-order-confirmation-page-editor></app-order-confirmation-page-editor> }
        @case ('policies') { <app-policies-page-editor></app-policies-page-editor> }
        @case ('product') { <app-product-page-editor></app-product-page-editor> }
        @case ('profile') { <app-profile-page-editor></app-profile-page-editor> }
        @case ('search') { <app-search-page-editor></app-search-page-editor> }
        @case ('sizeguide') { <app-size-guide-page-editor></app-size-guide-page-editor> }
        @default {
          <div class="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
            <h3 class="text-lg font-bold text-gray-900 mb-2">UOU O U,OU?O-Oc OUSO U,O O"U,Oc U,U,OO1O_USU,</h3>
            <p class="text-sm">U,O  USU.UU+ OOrOUSO UOU O U,OU?O-Oc U.U+ OrU,O U, O U,U.O-OO O U,O"OOUS O-O U,USO U<.</p>
            <p class="text-sm mt-2">U,U. O"OOU?O- O U,U.OOO (U.OU,: O U,OOUSO3USOcOO O U,U.U+OOO OOO O U,O3U,Oc) U,U,O"O_O U?US O U,OO1O_USU,.</p>
          </div>
        }
      }
    </div>
  `
})
export class EditorRouterComponent implements OnChanges {
  @Input() currentRoute: string = '';
  editorKey: string = 'fallback';
  isTransitioning: boolean = false;
  private transitionTimer: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentRoute']) {
      this.isTransitioning = true;
      clearTimeout(this.transitionTimer);

      this.transitionTimer = setTimeout(() => {
        this.updateEditorKey();
        this.isTransitioning = false;
      }, 150);
    }
  }

  private updateEditorKey() {
    const route = this.currentRoute;
    if (route === '/' || route === '') {
      this.editorKey = 'home';
    } else if (route.startsWith('/product/')) {
      this.editorKey = 'product';
    } else if (route.startsWith('/cart')) {
      this.editorKey = 'cart';
    } else if (route.startsWith('/categories')) {
      this.editorKey = 'categories';
    } else if (route.startsWith('/all-shapers')) {
      this.editorKey = 'allshapers';
    } else if (route.startsWith('/favorites')) {
      this.editorKey = 'favorites';
    } else if (route.startsWith('/offers')) {
      this.editorKey = 'offers';
    } else if (route.startsWith('/category/')) {
      this.editorKey = 'category';
    } else if (route.startsWith('/search')) {
      this.editorKey = 'search';
    } else if (route.startsWith('/size-guide')) {
      this.editorKey = 'sizeguide';
    } else if (route.startsWith('/checkout')) {
      this.editorKey = 'checkout';
    } else if (route.startsWith('/order-confirmation')) {
      this.editorKey = 'orderconfirmation';
    } else if (route.startsWith('/orders')) {
      this.editorKey = 'myorders';
    } else if (route.startsWith('/login')) {
      this.editorKey = 'login';
    } else if (route.startsWith('/profile')) {
      this.editorKey = 'profile';
    } else if (route.startsWith('/notifications')) {
      this.editorKey = 'notifications';
    } else if (route.startsWith('/about')) {
      this.editorKey = 'about';
    } else if (route.startsWith('/faq')) {
      this.editorKey = 'faq';
    } else if (route.startsWith('/policies')) {
      this.editorKey = 'policies';
    } else if (route.startsWith('/contact')) {
      this.editorKey = 'contact';
    } else {
      this.editorKey = 'fallback';
    }
  }
}
