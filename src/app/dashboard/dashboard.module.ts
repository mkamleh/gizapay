import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatMenuModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { SharedModule } from "app/shared/shared.module";
// import { TablePinningModule } from "app/tables/table-pinning/table-pinning.module";
// import { TablePinningComponent } from "app/tables/table-pinning/table-pinning.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
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
    SharedModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
