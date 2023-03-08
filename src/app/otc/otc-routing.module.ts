/** @format */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OtcComponent } from "./otc.component";

export const otcRoutes: Routes = [
  {
    path: "",
    component: OtcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(otcRoutes)],
  exports: [RouterModule]
})
export class OtcRoutingModule {}
