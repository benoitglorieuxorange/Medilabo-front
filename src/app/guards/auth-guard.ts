import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Supposons que ton AuthService possède une méthode qui renvoie un booléen
  if (authService.isLoggedIn()) {
    return true; // L'utilisateur est connecté, il peut voir la page
  }

  // L'utilisateur n'est pas connecté : on le renvoie au login
  router.navigate(['/login']);
  return false;
};
