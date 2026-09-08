import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const translateService = injector.get(TranslateService);
      let errorMessage = translateService.instant('ERROR.UNEXPECTED');
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = translateService.instant('ERROR.BROWSER').replace('${error.error.message}', error.error.message);
      } else {
        if (error.status === 401) {
          errorMessage = translateService.instant('ERROR.SESSION_EXPIRED');
        } else if (error.status === 403) {
          errorMessage = translateService.instant('ERROR.UNAUTHORIZED');
        } else if (error.status === 404) {
          errorMessage = translateService.instant('ERROR.NOT_FOUND');
        } else if (error.status >= 500) {
          errorMessage = translateService.instant('ERROR.SERVER_ERROR');
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      toastService.error(errorMessage);
      return throwError(() => error);
    })
  );
};
