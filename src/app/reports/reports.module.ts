import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatMenuModule,
  MatNativeDateModule,
  MatDatepickerModule,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "app/shared/shared.module";

import { reportsRoutes } from "./reports-routing.module";
import { QrReportComponent } from "./qr-report/qr-report.component";
import { ReportsComponent } from "./reports/reports.component";
import { RouterModule } from "@angular/router";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    ChartsModule,
    NgxChartsModule,
    NgxDatatableModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule.forChild(reportsRoutes),
    NgxQRCodeModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [ReportsComponent, QrReportComponent],
})
export class ReportsModule {}
