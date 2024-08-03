import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const employeeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Properly inject the Router service
  const user_id = localStorage.getItem('user_id');
  const accountType = localStorage.getItem('accountType');

  if (user_id && accountType == '2') {
    return true;
  } else {
    return router.navigateByUrl('/login'); // Redirect to login if not authenticated
  }
};

