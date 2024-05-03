import { Component, Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { DefaultService } from "../../openapi";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

@Injectable({
  providedIn: 'root',
})
export class RegisterComponent {
  public username: string = "";
  public password: string = "";
  public email: string = "";
  public errorMessage: string = "";
  public isLoading: boolean = false;

  constructor(private api: DefaultService, private router: Router) {
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('username')) {
      this.router.navigate(['']).then(() => console.log('User is already logged in, navigating to main panel'));
    }
  }

  public registerUser(): void {
    this.isLoading = true;
    this.api.createUser({username: this.username, password: this.password,
      email: this.email}).subscribe({
      next: (userDto) => {
        this.router.navigate(['email-confirmation']).then(() => console.log('Successfully registered user, navigating to login panel'));
        sessionStorage.setItem('id', <string> userDto.id);
        sessionStorage.setItem('awaiting-email-confirmation', "true");
        this.isLoading = false;
      },
      error: error => {
        if (error.status === 409) {
          this.errorMessage = 'Login i/lub adres email jest już zajęty.';
          this.isLoading = false;
        }
      }
    });
  }
}
