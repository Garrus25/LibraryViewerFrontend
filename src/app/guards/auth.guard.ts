import { Injectable } from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
     if (sessionStorage.getItem('username') !== null){
       return true;
     }
     this.router.navigate(['login']).then(r => console.log('User is not logged in, navigating to login panel'));
     return false;
  }
}
