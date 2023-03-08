/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatMenuModule,
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { BankRoutes } from "./bank-routing.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DemoMaterialModule } from "app/shared/demo.module";
import { HttpModule } from "@angular/http";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { LinkT24AccountComponent } from "./link-t24-account/link-t24-account";
import { LoadMoneyComponent } from "./load-money/load-money";
import { NgProgressModule } from "ngx-progressbar";
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(BankRoutes),
    FlexLayoutModule,
    ChartsModule,
    FlexLayoutModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ChartsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    FlexLayoutModule,
    NgxQRCodeModule,
    NgProgressModule,
  ],
  declarations: [LinkT24AccountComponent, LoadMoneyComponent],
})
export class BankModule {}
