import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuth()) {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};

export const authGuardLoggdIn: CanActivateFn = (route, state) => {
  const role = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}').role;
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuth() && role === 'Admin') {
    return router.navigate(['/admin']);
  }
  if (authService.isAuth()) {
    return router.navigate(['/']);
  }
  return true;
};
