import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            console.error(`[HTTP ${err.status}] ${req.method} ${req.url}`);
            if (err.status === 401 && !req.url.includes('/auth/')) {
                authService.logout();          // supprime le token stocké
                router.navigate(['/login']);
            }
            return throwError(() => err);
        })
    );
};
