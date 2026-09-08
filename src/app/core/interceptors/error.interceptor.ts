import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/assets/') || req.url.includes('assets/i18n')) {
    return next(req);
  }

  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const toastService = injector.get(ToastService, null, { optional: true });
      const translateService = injector.get(TranslateService, null, { optional: true });
      let errorMessage = translateService ? translateService.instant('ERROR.UNEXPECTED') : 'Unexpected error';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = (translateService ? translateService.instant('ERROR.BROWSER') : '${error.error.message}').replace('${error.error.message}', error.error.message);
      } else {
        if (error.status === 401) {
          errorMessage = translateService ? translateService.instant('ERROR.SESSION_EXPIRED') : 'Session expired';
        } else if (error.status === 403) {
          errorMessage = translateService ? translateService.instant('ERROR.UNAUTHORIZED') : 'Unauthorized';
        } else if (error.status === 404) {
          errorMessage = translateService ? translateService.instant('ERROR.NOT_FOUND') : 'Not found';
        } else if (error.status >= 500) {
          errorMessage = translateService ? translateService.instant('ERROR.SERVER_ERROR') : 'Server error';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      if (toastService) {
        toastService.error(errorMessage);
      }
      return throwError(() => error);
    })
  );
};
