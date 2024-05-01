import {Component, Injectable} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {DefaultService} from "../../openapi";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
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
