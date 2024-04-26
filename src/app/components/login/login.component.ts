import { Component } from '@angular/core';
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

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
    MatLabel
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  public loginValid = true;

  public onSubmit(): void {
    console.log('Form submitted');
  }

}
