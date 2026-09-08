import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { ToastService } from '../services/toast/toast.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    if (environment.enableLogging) {
      console.error('[GlobalErrorHandler]', error);
    }
    
  }
}
