import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportsComponent } from "./reports/reports.component";
import { QrReportComponent } from "./qr-report/qr-report.component";
import { BranchTransactionsComponent } from "app/reports/branch-transactions/branch-transactions.component";

export const reportsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "wallet-report",
        component: ReportsComponent
      },
      {
        path: "qr-report",
        component: QrReportComponent
      },
      {
        path: "otc-report",
        component: BranchTransactionsComponent,
      },
    ]
  }
];

export class ReportsRoutingModule {}
