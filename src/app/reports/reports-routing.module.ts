import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportsComponent } from "./reports/reports.component";
import { QrReportComponent } from "./qr-report/qr-report.component";

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(reportsRoutes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
