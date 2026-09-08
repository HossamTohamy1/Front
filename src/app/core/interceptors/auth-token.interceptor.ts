import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(`${environment.storagePrefix}auth-token`);
  
  const isApiRequest = 
    req.url.startsWith('/api') || 
    req.url.startsWith(environment.apiBaseUrl) || 
    req.url.startsWith('http://localhost:5050/api');

  if (isApiRequest) {
    const cloneConfig: any = {
      withCredentials: true
    };
    
    if (token) {
      cloneConfig.setHeaders = {
        Authorization: `Bearer ${token}`
      };
    }
    
    const cloned = req.clone(cloneConfig);
    return next(cloned);
  }

  return next(req);
};
