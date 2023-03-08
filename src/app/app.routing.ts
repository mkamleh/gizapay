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
        loadChildren: "./dashboard/dashboard.module#DashboardModule",
      },
      {
        path: "customer",
        loadChildren:
          "./customer-management-new/customer-management-new.module#CustomerManagementNewModule",
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
        loadChildren: "./finance/finance.module#FinanceModule",
      },
      {
        path: "",
        loadChildren: "./bank/bank.module#BankModule",
      },
      {
        path: "otc",
        loadChildren: "./otc/otc.module#OtcModule",
      },
      {
        path: "reports",
        loadChildren: "./reports/reports.module#ReportsModule",
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
          "./user-managment/user-managment.module#UserManagmentModule",
      },
      {
        path: "customer/customer-managment",
        loadChildren:
          "./customermanagment/customermanagment.module#CustomermanagmentModule",
      },
      {
        path: "branch",
        loadChildren: "./branch-pages/branch.module#BranchModule",
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
        loadChildren: "./usermaster-pages/usersmaster.module#UserMasterModule",
      },
      {
        path: "user-pages",
        loadChildren: "./user-pages/users.module#UsersModule",
      },

      {
        path: "branch",
        loadChildren: "./branch-pages/branch.module#BranchModule",
      },
      {
        path: "pages",
        loadChildren: "./custom-pages/pages.module#PagesDemoModule",
      },
      {
        path: "session",
        loadChildren: "./error/error.module#ErrorModule",
      },
    ],
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "authentication",
        loadChildren: "./session/session.module#SessionModule",
      },
      {
        path: "error",
        loadChildren: "./error/error.module#ErrorModule",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "home",
  },
];
