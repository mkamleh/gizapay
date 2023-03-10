/** @format */

import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./auth/auth-layout.component";
import { AuthGuardService } from "./_services/auth-guard.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginSignupComponent } from "./auth/login-signup/login-signup.component";
import { ForgotPasswordComponent } from "./auth/forgot-password/forgot-password.component";

export const AppRoutes: Routes = [
  {
    path: "home",
    redirectTo: "dashboard",
    pathMatch: "full",
    canActivate: [AuthGuardService],
  },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
    canActivate: [AuthGuardService],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    children: [
      {
        path: "login-signup",
        component:LoginSignupComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "customer",
        loadChildren: () => import('./customers/customer-management-new.module').then(m => m.CustomerManagementNewModule),
      },
      {
        path: "user-profile",
        loadChildren:() => import('./user-profile/user-profile.module').then(m => m.userProfileModule),
      },
      {
        path: "transfer",
        loadChildren: () => import('./transfer/transfer.module').then(m => m.transferModule),
      },
      {
        path: "finance",
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
      },
      {
        path: "otc",
        loadChildren: () => import('./otc/otc.module').then(m => m.OtcModule),
      },
      {
        path: "reports",
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: "air-time-topup",
        loadChildren: () => import('./air-time-top-up/air-time-top-up-module').then(m => m.airTimePopupModule),
      },
      {
        path: "",//pay and loadmoney route
        loadChildren: () => import('./bills/bills.module').then(m => m.billsModule),
      },
    ],
  },
];
