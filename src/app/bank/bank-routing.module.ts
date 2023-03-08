/** @format */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LinkT24AccountComponent } from "./link-t24-account/link-t24-account";
import { LoadMoneyComponent } from "./load-money/load-money";

export const BankRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "link-t24-account",
        component: LinkT24AccountComponent,
      },
      {
        path: "load-money",
        component: LoadMoneyComponent,
      },
    ],
  },
];
