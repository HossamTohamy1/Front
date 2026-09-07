import { Routes } from '@angular/router';

export const STOREFRONT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories-page/categories-page.component').then(m => m.CategoriesPageComponent)
  },
  {
    path: 'all-shapers',
    loadComponent: () => import('./pages/all-shapers-page/all-shapers-page.component').then(m => m.AllShapersPageComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent)
  },
  {
    path: 'offers',
    loadComponent: () => import('./pages/offers-page/offers-page.component').then(m => m.OffersPageComponent)
  },
  {
    path: 'category/all',
    redirectTo: 'all-shapers',
    pathMatch: 'full'
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/category-page/category-page.component').then(m => m.CategoryPageComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-page/search-page.component').then(m => m.SearchPageComponent)
  },
  {
    path: 'size-guide',
    loadComponent: () => import('./pages/size-guide-page/size-guide-page.component').then(m => m.SizeGuidePageComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component').then(m => m.CartPageComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout-page/checkout-page.component').then(m => m.CheckoutPageComponent)
  },
  {
    path: 'order-confirmation',
    loadComponent: () => import('./pages/order-confirmation-page/order-confirmation-page.component').then(m => m.OrderConfirmationPageComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/my-orders-page/my-orders-page.component').then(m => m.MyOrdersPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
  },
  {
    path: 'account',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  {
    path: 'my-account',
    redirectTo: 'profile',
    pathMatch: 'full'
  },
  {
    path: 'my-orders',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent)
  },
  {
    path: 'chat',
    redirectTo: 'profile?chat=open',
    pathMatch: 'full'
  },
  {
    path: 'support',
    redirectTo: 'profile?chat=open',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page/about-page.component').then(m => m.AboutPageComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq-page/faq-page.component').then(m => m.FaqPageComponent)
  },
  {
    path: 'policies',
    loadComponent: () => import('./pages/policies-page/policies-page.component').then(m => m.PoliciesPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page/contact-page.component').then(m => m.ContactPageComponent)
  }
];
