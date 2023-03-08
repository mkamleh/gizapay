/** @format */

import { Routes } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { PricingComponent } from "./pricing/pricing.component";

export const PagesRoutes: Routes = [
  {
    path: "",
    redirectTo: "about",
    pathMatch: "full"
  },
  {
    path: "",
    children: [
      {
        path: "about",
        component: AboutComponent
      },
      {
        path: "contact",
        component: ContactComponent
      },

      {
        path: "pricing",
        component: PricingComponent
      }
    ]
  }
];
