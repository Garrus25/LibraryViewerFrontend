import { Injectable } from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationAuthGuard {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkIfEmailConfirmationIsExpected();
  }

  private checkIfEmailConfirmationIsExpected(): boolean {
    if (sessionStorage.getItem('awaiting-email-confirmation') == "true"){
      return true;
    }
    this.router.navigate(['login']).then( () => console.log('No ongoing email confirmation, navigating to login panel'));
    return false;
  }
}
