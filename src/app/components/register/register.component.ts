import {Component, Injectable} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {DefaultService} from "../../openapi";

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
    RouterLink
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

  constructor(private api: DefaultService, private router: Router) {
  }

  public registerUser(): void {
    this.api.createUser({username: this.username, password: this.password,
    email: this.email}).subscribe({
      next: response => {
        this.router.navigate(['login']).then(r => console.log('Successfully registered user, navigating to login panel'));
      },
      error: error => {
        if (error.status === 409) {
          this.errorMessage = 'Login i/lub adres email jest już zajęty.';
        }
      }
    });
    }
}
