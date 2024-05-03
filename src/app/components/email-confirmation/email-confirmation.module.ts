import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [EmailConfirmationComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [EmailConfirmationComponent]
})
export class EmailConfirmationModule { }
