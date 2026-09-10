import { Routes } from '@angular/router';
import { dashboardGuard } from '../core/guards/dashboard.guard';

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
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

