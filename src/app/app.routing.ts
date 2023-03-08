/** @format */

import { Routes } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { AuthGuardService } from "./_services/auth-guard.service";
import { ChangePasswordMasterComponent } from "./layouts/change-password-master/change-password-master.component";
import { ChangePasswordComponent } from "./layouts/change-password/change-password.component";
import { InquiryComponent } from "./bills/inquiry/inquiry.component";
import { PayComponent } from "./bills/pay/pay.component";
import { UserProfileComponent } from "./layouts/user-profile/user-profile.component";
import { BulkAirTimeTopupComponent } from "./bulk-air-time-topup/bulk-air-time-topup.component";
import { BoaComponent } from "./boa/boa.component";
import { BulkSalaryComponent } from "./bulk-salary/bulk-salary.component";
import { B2pTransferComponent } from "./b2p-transfer/b2p-transfer.component";
import { B2bTransferComponent } from "./b2b-transfer/b2b-transfer.component";
import { SellAirtimeTopUpComponent } from "./sell-airtime-top-up/sell-airtime-top-up.component";
import { ChangeSecurityQuestionComponent } from "./change-security-question/change-security-question.component";
import { OtcSendComponent } from "./otc-send/otc-send.component";
import { OtcReceiveComponent } from "./otc-receive/otc-receive.component";
import { BranchTransactionsComponent } from "./branch-transactions/branch-transactions.component";
import { PayBillComponent } from "./bills/pay-bill/pay-bill.component";
import { PaySchoolBillComponent } from "./bills/pay-school-bill/pay-school-bill.component";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
    canActivate: [AuthGuardService],
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: "home",
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: "customer",
        loadChildren:
          () => import('./customer-management-new/customer-management-new.module').then(m => m.CustomerManagementNewModule),
      },
      {
        path: "change-password-master",
        component: ChangePasswordMasterComponent,
      },
      {
        path: "change-security-question",
        component: ChangeSecurityQuestionComponent,
      },
      {
        path: "otc/otc-send",
        component: OtcSendComponent,
      },
      {
        path: "otc/otc-receive",
        component: OtcReceiveComponent,
      },
      {
        path: "reports/otc-report",
        component: BranchTransactionsComponent,
      },
      {
        path: "user-profile",
        component: UserProfileComponent,
      },
      {
        path: "air-time-topup/bulk-air-time-topup",
        component: BulkAirTimeTopupComponent,
      },
      {
        path: "transfer/bulk-salary-upload",
        component: BulkSalaryComponent,
      },
      {
        path: "air-time-topup/sell-airtime-top-up",
        component: SellAirtimeTopUpComponent,
      },
      {
        path: "transfer/transfer-to-cbs",
        component: BoaComponent,
      },
      {
        path: "transfer/b2p-transfer",
        component: B2pTransferComponent,
      },
      {
        path: "transfer/b2b-transfer",
        component: B2bTransferComponent,
      },
      {
        path: "finance",
        loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule),
      },
      {
        path: "",
        loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
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
        path: "bills/inquiry",
        component: InquiryComponent,
      },
      {
        path: "bills/pay",
        component: PayComponent,
      },
      {
        path: "pay-bill",
        component: PayBillComponent,
      },
      {
        path: "pay-school-bill",
        component: PaySchoolBillComponent,
      },
      {
        path: "managment",
        loadChildren:
          () => import('./user-managment/user-managment.module').then(m => m.UserManagmentModule),
      },
      {
        path: "customer/customer-managment",
        loadChildren:
          () => import('./customermanagment/customermanagment.module').then(m => m.CustomermanagmentModule),
      },
      {
        path: "branch",
        loadChildren: () => import('./branch-pages/branch.module').then(m => m.BranchModule),
      },
      // {
      //   path: "pay-school-bill",
      //   loadChildren:
      //     "./pay-school-bill/pay-school-bill.module#PaySchoolBillModule"
      // },
      {
        path: "change-password",
        component: ChangePasswordComponent,
      },

      {
        path: "user-pages-master",
        loadChildren: () => import('./usermaster-pages/usersmaster.module').then(m => m.UserMasterModule),
      },
      {
        path: "user-pages",
        loadChildren: () => import('./user-pages/users.module').then(m => m.UsersModule),
      },

      {
        path: "branch",
        loadChildren: () => import('./branch-pages/branch.module').then(m => m.BranchModule),
      },
      {
        path: "pages",
        loadChildren: () => import('./custom-pages/pages.module').then(m => m.PagesDemoModule),
      },
      {
        path: "session",
        loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "authentication",
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
      },
      {
        path: "error",
        loadChildren: () => import('./error/error.module').then(m => m.ErrorModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "home",
  },
];
