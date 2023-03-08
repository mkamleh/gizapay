/** @format */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CashInComponent } from "./cash-in/cash-in.component";
import { CashOutComponent } from "./cash-out/cash-out.component";
import { GenerateQrComponent } from "./generate-qr/generate-qr.component";

export const FinanceRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "cash-in",
        component: CashInComponent,
      },
      {
        path: "cash-out",
        component: CashOutComponent,
      },
      {
        path: "qr-voucher",
        component: GenerateQrComponent,
      },
    ],
  },
];
