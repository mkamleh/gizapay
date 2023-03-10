/** @format */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OtcComponent } from "./otc(unknown)/otc.component";
import { OtcSendComponent } from "./otc-send/otc-send.component";
import { OtcReceiveComponent } from "./otc-receive/otc-receive.component";

export const otcRoutes: Routes = [
  // {
  //   path: "",
  //   component: OtcComponent
  // },
  {
    path: "otc-send",
    component: OtcSendComponent
  },
  {
    path: "otc-receive",
    component: OtcReceiveComponent
  }
];

export class OtcRoutingModule {}
