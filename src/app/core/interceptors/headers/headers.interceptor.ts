import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  if (cookieService.check('userToken')) {
    req = req.clone({
      setHeaders: {
        token: cookieService.get('userToken')!,
      },
    });
  }
  return next(req);
};
