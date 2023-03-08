/** @format */

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material";
import {
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatButtonModule,
  MatProgressBarModule,
  MatToolbarModule,
} from "@angular/material";
import { ErrorOneComponent } from "./404/error-404.component";
import { ErrorTwoComponent } from "./503/error-503.component";

import { ErrorRoutes } from "./error.routing";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    RouterModule.forChild(ErrorRoutes),
    SharedModule,
  ],
  declarations: [ErrorOneComponent, ErrorTwoComponent],
})
export class ErrorModule {}
