import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const token = authService.getToken();

    const isAuthRequest = req.url.includes('/auth/');

    if (token && !isAuthRequest) {
        return next(req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        }));
    }

    return next(req);

};
