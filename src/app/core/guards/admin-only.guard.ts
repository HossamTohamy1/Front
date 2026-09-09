import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminOnlyGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is already loaded and is admin
  if (authService.user()?.role === 'admin') {
    return true;
  }

  // If there's a token but user hasn't loaded yet (e.g. on hard refresh)
  if (authService.getToken() && !authService.isAuthenticated()) {
    const user = await authService.fetchUser();
    if (user?.role === 'admin') {
      return true;
    }
  }

  return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};
