import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";

const routeConfig: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login Page'
  }
];

export default routeConfig;
