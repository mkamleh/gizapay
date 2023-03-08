/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomermanagmentRoutingModule } from "./customermanagment-routing.module";
import { CustomerManagmentComponent } from "./customer-managment/customer-managment.component";
import { SharedModule } from "app/shared/shared.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material";
import { NgProgressModule } from "ngx-progressbar";

@NgModule({
  declarations: [CustomerManagmentComponent],
  imports: [
    CommonModule,
    CustomermanagmentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
    NgProgressModule,
  ],
})
export class CustomermanagmentModule {}
