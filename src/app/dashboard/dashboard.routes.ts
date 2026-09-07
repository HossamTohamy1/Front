import { Routes } from '@angular/router';
import { dashboardGuard } from '../core/guards/dashboard.guard';
import { adminOnlyGuard } from '../core/guards/admin-only.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/admin-login-page/admin-login-page.component').then(m => m.AdminLoginPageComponent)
  },
  {
    path: '',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/dashboard-home-page/dashboard-home-page.component').then(m => m.DashboardHomePageComponent)
  },
  {
    path: 'store-customizer',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/customize-home/customize-home-page.component').then(m => m.CustomizeHomePageComponent)
  },
  {
    path: 'store-management',
    redirectTo: 'store-customizer',
    pathMatch: 'full'
  },
  {
    path: 'customize-home',
    redirectTo: 'store-customizer',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/orders-page/orders-page.component').then(m => m.OrdersPageComponent)
  },
  {
    path: 'orders/:id',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/order-review-page/order-review-page.component').then(m => m.OrderReviewPageComponent)
  },
  {
    path: 'products',
    redirectTo: 'store-customizer',
    pathMatch: 'full'
  },
  {
    path: 'categories',
    redirectTo: 'store-customizer',
    pathMatch: 'full'
  },
  {
    path: 'offers',
    redirectTo: 'store-customizer',
    pathMatch: 'full'
  },
  {
    path: 'reviews',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/reviews-moderation-page/reviews-moderation-page.component').then(m => m.ReviewsModerationPageComponent)
  },
  {
    path: 'chat',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'invoices',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/invoices-page/invoices-page.component').then(m => m.InvoicesPageComponent)
  },
  {
    path: 'notifications',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/admin-notifications-page/admin-notifications-page.component').then(m => m.AdminNotificationsPageComponent)
  },
  {
    path: 'operations',
    canActivate: [dashboardGuard],
    loadComponent: () => import('./pages/operations-center-page/operations-center-page.component').then(m => m.OperationsCenterPageComponent)
  },
  {
    path: 'accounts',
    canActivate: [adminOnlyGuard],
    loadComponent: () => import('./pages/accounts-page/accounts-page.component').then(m => m.AccountsPageComponent)
  },
  {
    path: 'edit-logs',
    canActivate: [adminOnlyGuard],
    loadComponent: () => import('./pages/edit-logs-page/edit-logs-page.component').then(m => m.EditLogsPageComponent)
  }
];
