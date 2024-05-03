import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TopBarModule } from '../top-bar/top-bar.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MatCardModule,
    NgxMatSelectSearchModule,
    TopBarModule,
    MatSelectModule
  ],
  exports: [MainComponent]
})
export class MainModule { }
