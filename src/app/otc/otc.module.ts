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
  MatDatepickerModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { ChartsModule } from "ng2-charts/ng2-charts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DemoMaterialModule } from "app/shared/demo.module";
import { HttpModule } from "@angular/http";
import { NgxQRCodeModule } from "ngx-qrcode2";

import { OtcRoutingModule } from "./otc-routing.module";
import { otcRoutes } from "./otc-routing.module";
import { OtcComponent } from "./otc.component";

@NgModule({
  declarations: [OtcComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(otcRoutes),
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
    NgxQRCodeModule
  ]
})
export class OtcModule {}
