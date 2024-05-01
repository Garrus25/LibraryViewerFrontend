import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {MainComponent} from "./components/main/main.component";
import {AuthGuard} from "./guards/auth.guard";
import {EmailConfirmationComponent} from "./email-confirmation/email-confirmation.component";

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
    title: 'Email Confirmation Page'
  }
];

export default routeConfig;
