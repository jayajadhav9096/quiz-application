import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../app/services/login.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  
  return loginService.loggedInUserDetils$.pipe(map(user => {
    if (user && user.role === 'admin') {
      return true;
    } 
    router.navigate(['/access-denied']);
     return false;
  }));
};
