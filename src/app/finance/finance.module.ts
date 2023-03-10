/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { SharedModule } from "app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { FinanceRoutes } from "./finance-routing.module";
import { CashInComponent, DialogContentDialog } from "./cash-in/cash-in.component";
import { CashOutComponent, DialogContentDialog1 } from "./cash-out/cash-out.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DemoMaterialModule } from "app/shared/demo.module";
import { GenerateQrComponent } from "./generate-qr/generate-qr.component";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { NgProgressModule } from "ngx-progressbar";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(FinanceRoutes),
    FlexLayoutModule,
    ChartsModule,
    FlexLayoutModule,
    MatDatepickerModule,
    FlexLayoutModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    FlexLayoutModule,
    NgxQRCodeModule,
    NgProgressModule,
  ],
  declarations: [
    CashInComponent,
    CashOutComponent,
    GenerateQrComponent,
    DialogContentDialog,
    DialogContentDialog1],
  entryComponents: [
    DialogContentDialog,
    DialogContentDialog1
  ]
})
export class FinanceModule {}
