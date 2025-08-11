import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../app/services/login.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  return loginService.loggedInUserDetils$.pipe(map(user=>{
    // console.log('user', user);
    if(user){
      return true;
    }else{
      router.navigate(['/login']);
      return false;
    }
  }),
  )
};
