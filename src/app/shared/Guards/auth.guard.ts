import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Properly inject the Router service
  const user_id = localStorage.getItem('user_id');
  const accountType = localStorage.getItem('accountType');

  if (user_id) {
    if (accountType === '1') {
      if (state.url.includes('/admin')) {
        return true; // Allow access to admin routes
      } else {
        return router.navigateByUrl('/admin'); // Redirect to /admin if the URL doesn't include it
      }
    } else {
      if (state.url.includes('/home')) {
        return true; // Allow access to home routes
      } else {
        return router.navigateByUrl('/home'); // Redirect to /home if the URL doesn't include it
      }
    }
  } else {
    return router.navigateByUrl('/login'); // Redirect to login if not authenticated
  }
};
