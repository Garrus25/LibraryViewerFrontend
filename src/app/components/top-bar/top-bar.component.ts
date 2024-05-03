import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [
    MatCard,
    MatInput,
    MatButton,
    MatFormField,
    MatIconButton,
    MatIcon,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelect
  ],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

}
