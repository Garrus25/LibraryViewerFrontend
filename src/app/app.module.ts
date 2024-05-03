import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { TopBarModule } from './components/top-bar/top-bar.module';
import { RegisterModule } from './components/register/register.module';
import { MainModule } from './components/main/main.module';
import { LoginModule } from './components/login/login.module';
import { EmailConfirmationModule } from './components/email-confirmation/email-confirmation.module';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

import routeConfig from './app.routes';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routeConfig),
    TopBarModule,
    RegisterModule,
    MainModule,
    LoginModule,
    EmailConfirmationModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
