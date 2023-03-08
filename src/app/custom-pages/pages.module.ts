/** @format */

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatButtonModule,
  MatProgressBarModule,
  MatToolbarModule,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { PricingComponent } from "./pricing/pricing.component";

import { PagesRoutes } from "./pages.routing";
import { NgProgressModule } from "ngx-progressbar";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),

    FormsModule,
    MatCardModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    FlexLayoutModule,
    NgProgressModule,
  ],
  declarations: [AboutComponent, ContactComponent, PricingComponent],
})
export class PagesDemoModule {}
