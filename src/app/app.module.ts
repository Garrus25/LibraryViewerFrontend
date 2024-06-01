import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox"; // Dodaj to
import { MatIconModule } from "@angular/material/icon"; // Dodaj to

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
import {BookDetailsComponent} from "./components/book-details/book-details.component";
import {AuthorDetailsComponent} from "./components/author-details/author-details.component";
import {AllBooksComponent} from "./components/all-books/all-books.component";
import {RateComponent} from "./components/rate/rate.component";
import {MatSliderModule} from "@angular/material/slider";
import {UserPanelSmallComponent} from "./components/user-panel-small/user-panel-small.component";
import {UserPanelComponent} from "./components/user-panel/user-panel.component";
import {AllAuthorsComponent} from "./components/all-authors/all-authors.component";
import {AddBookFormComponent} from "./components/add-book-form/add-book-form-component";
import {AddAuthorFormComponent} from "./components/add-author-form/add-author-form.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AddReviewFormComponent} from "./components/add-review-form/add-review-form.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TopBarComponent,
    MainComponent,
    EmailConfirmationComponent,
    RegisterComponent,
    BookDetailsComponent,
    AuthorDetailsComponent,
    AllBooksComponent,
    RateComponent,
    UserPanelSmallComponent,
    UserPanelComponent,
    AddBookFormComponent,
    AllAuthorsComponent,
    AddAuthorFormComponent,
    AddReviewFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routeConfig, {onSameUrlNavigation: 'reload'}),
    MatProgressSpinnerModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    MatSliderModule,
    BrowserAnimationsModule,
    HammerModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    TopBarComponent
  ]
})
export class AppModule { }
