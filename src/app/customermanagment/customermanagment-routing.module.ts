/** @format */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CustomerManagmentComponent } from "./customer-managment/customer-managment.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerManagmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomermanagmentRoutingModule {}
