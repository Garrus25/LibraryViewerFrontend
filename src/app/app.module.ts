import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";

import routeConfig from './app.routes';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { LoginComponent } from "./components/login/login.component";
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import { MainComponent } from "./components/main/main.component";
import { EmailConfirmationComponent } from "./components/email-confirmation/email-confirmation.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import {RegisterComponent} from "./components/register/register.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIcon} from "@angular/material/icon";
import {BookDetailsComponent} from "./components/book-details/book-details.component";
import {AuthorDetailsComponent} from "./components/author-details/author-details.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopBarComponent,
    MainComponent,
    EmailConfirmationComponent,
    RegisterComponent,
    BookDetailsComponent,
    AuthorDetailsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routeConfig, { onSameUrlNavigation: 'reload' }),
    MatProgressSpinnerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIcon
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    TopBarComponent
  ]
})
export class AppModule { }
