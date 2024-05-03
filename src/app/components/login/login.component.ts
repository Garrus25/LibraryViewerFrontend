import {Component, Injectable} from '@angular/core';
import {DefaultService} from "../../openapi";
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({
  providedIn: 'root',
})
export class LoginComponent {
   public loginValid = true;
   public login: string = "";
   public password: string = "";

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      this.router.navigate(['']).then(() => console.log('User is already logged in, navigating to main panel'));
    }
  }

  public onSubmit(): void {
    this.api.checkUserCredentials({username: this.login,
      password: this.password}).subscribe({
      next: response => {
        this.loginValid = response.token === null;
        sessionStorage.setItem('username', this.login);
        sessionStorage.setItem('id', <string> response.id);
        sessionStorage.setItem('token', <string> response.token);
        sessionStorage.setItem('refreshToken', <string> response.refreshToken);

        this.router.navigate(['']).then( () => console.log('User successfully logged in, navigating to main panel'));
      },
      error: error => {
        console.error('Error during checking user credentials:', error);
        this.loginValid = false;
      }
    });
  }

}
