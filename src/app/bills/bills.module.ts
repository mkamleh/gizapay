/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { BulkAirTimeTopupComponent } from "app/air-time-top-up/bulk-air-time-topup/bulk-air-time-topup.component";
import { SellAirtimeTopUpComponent } from "app/air-time-top-up/sell-airtime-top-up/sell-airtime-top-up.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatIconModule } from "@angular/material";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FileUploadModule } from "ng2-file-upload";
import { RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { billsRoutes } from "./bills-routing";
import { PayBillComponent } from "./pay-bill/pay-bill.component";
import { PaySchoolBillComponent } from "./pay-school-bill/pay-school-bill.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { LoadMoneyComponent } from "./load-money/load-money";
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations:[
    PayBillComponent,
    PaySchoolBillComponent,
    LoadMoneyComponent
  ],
  imports:[
      FormsModule,
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,
      TranslateModule,
      MatIconModule,
      FileUploadModule,
      MatSelectModule,
      NgxMatSelectSearchModule,
      CommonModule,
      RouterModule.forChild(billsRoutes),
      MatStepperModule,
      MatCardModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatRadioModule,
      MatSelectModule,
  ],
  providers:[
      TranslateService
  ]
})

export class billsModule {}




