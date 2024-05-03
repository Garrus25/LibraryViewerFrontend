import { Component } from '@angular/core';
import {TopBarComponent} from "../top-bar/top-bar.component";
import {RouterOutlet} from "@angular/router";
import {MatCard} from "@angular/material/card";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    TopBarComponent,
    RouterOutlet,
    MatCard,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelect
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
