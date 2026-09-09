import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const GUEST_ID_KEY = 'lk-guest-id';

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guestId)) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
}

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest =
    Boolean(environment.apiBaseUrl && req.url.startsWith(environment.apiBaseUrl)) ||
    Boolean(environment.apiUrl && req.url.startsWith(environment.apiUrl)) ||
    req.url.startsWith('/api');

  if (isApiRequest) {
    const token = typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem(`${environment.storagePrefix}auth-token`)
      : null;
    const guestId = getOrCreateGuestId();

    const setHeaders: Record<string, string> = {};
    if (token) {
      setHeaders['Authorization'] = `Bearer ${token}`;
    }
    if (guestId) {
      setHeaders['X-Guest-Id'] = guestId;
    }

    const cloned = req.clone({
      withCredentials: true,
      setHeaders
    });
    return next(cloned);
  }

  return next(req);
};

