import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {MainComponent} from "./components/main/main.component";
import {AuthGuard} from "./guards/auth.guard";
import {EmailConfirmationComponent} from "./components/email-confirmation/email-confirmation.component";
import {EmailConfirmationAuthGuard} from "./guards/email-confirmation.auth.guard";
import {BookDetailsComponent} from "./components/book-details/book-details.component";

const routeConfig: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register Page'
  },
  {
    path: '',
    component: MainComponent,
    title: 'Main Page',
    canActivate: [AuthGuard]
  },
  {
    path: 'email-confirmation',
    component: EmailConfirmationComponent,
    title: 'Email Confirmation Page',
    canActivate: [EmailConfirmationAuthGuard]
  },
  {
    path: 'book-details/:isbn',
    component: BookDetailsComponent,
    title: 'Book details'
  }

];

export default routeConfig;
