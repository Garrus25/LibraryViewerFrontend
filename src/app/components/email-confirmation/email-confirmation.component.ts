import { Component, OnInit } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import { DefaultService } from "../../openapi";
import {interval, takeWhile} from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [
    MatCard,
    MatButton,
    RouterLink,
    NgIf,
    CommonModule
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit {
  public emailConfirmed: boolean = false;
  public emailReSent: boolean = false;

  constructor(private api: DefaultService, private router: Router) {}

  ngOnInit(): void {
    this.checkEmailConfirmation();
  }

  checkEmailConfirmation(): void {
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.api.checkIfEmailIsConfirmed({id: sessionStorage.getItem('id') ?? ''})),
        takeWhile(() => !this.emailConfirmed)
      )
      .subscribe(response => {
        if (response) {
          console.log('Email confirmed');
          this.emailConfirmed = true;
        } else {
          console.log('Email not confirmed, checking again in 5 seconds');
        }
      });
  }

  backToRegister(): void {
    sessionStorage.setItem('id', '');
    this.router.navigate(['register']).then(() => console.log('Aborting email confirmation, navigating back to register panel'));
  }

  backToLogin(): void {
    if (!this.emailConfirmed) {
      sessionStorage.setItem('id', '');
    }
    this.router.navigate(['']).then(() => console.log('Redirecting to login panel'));
  }

  resendEmail(): void {
    this.emailReSent = true;
    this.api.resendEmail({id: sessionStorage.getItem('id') ?? ''}).subscribe({
      next: () => {
        console.log('Email resent');
        this.emailReSent = true;
      },
      error: error => {
        console.error('Error during resending email:', error);
      }
    });
  }
}
