import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const { routeConfig } = route;
  const role = JSON.parse(localStorage.getItem('CURRENT_USER') || '{}').role;
  const authService = inject(AuthService);
  const { path } = routeConfig as Route;
  if (path === '' && !authService.isAuth()) {
    return true;
  }
  if (path === 'admin' && (role === 'Admin' || role === 'SuperAdmin')) {
    return true;
  }
  router.navigateByUrl(
    role === 'Admin' || role === 'SuperAdmin' ? 'admin' : '/'
  );
  return false;
};
