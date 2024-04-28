import {Component, Injectable} from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {DefaultService} from "../../openapi";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatSlideToggle,
    MatCardContent,
    MatError,
    MatCard,
    FormsModule,
    NgIf,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

@Injectable({
  providedIn: 'root',
})
export class LoginComponent {
   public loginValid = true;
   public username: string = "";
   public password: string = "";

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      this.router.navigate(['']).then(() => console.log('User is already logged in, navigating to main panel'));
    }
  }

  public onSubmit(): void {
    this.api.checkUserCredentials({username: this.username,
      password: this.password}).subscribe({
      next: response => {
        this.loginValid = response.token === null;
        sessionStorage.setItem('username', this.username);
        sessionStorage.setItem('privilegeLevel', "user");
        sessionStorage.setItem('token', <string> response.token);
        sessionStorage.setItem('token', <string> response.refreshToken);

        this.router.navigate(['']).then( () => console.log('User successfully logged in, navigating to main panel'));
      },
      error: error => {
        console.error('Error during checking user credentials:', error);
        this.loginValid = false;
      }
    });
  }

}
