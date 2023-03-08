/** @format */

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule, Http } from "@angular/http";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorIntercept } from './_services/ErrorIntercept'

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoMaterialModule } from "./shared/demo.module";

import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import {
  
  DialogContentDialogBulkSU,
} from "./bulk-salary/bulk-salary.component";
import {
  
  DialogContentDialogBulkATT,
} from "./bulk-air-time-topup/bulk-air-time-topup.component";

import { AppRoutes } from "./app.routing";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { SharedModule } from "./shared/shared.module";
import { CookieService } from "ngx-cookie-service";
import { RecaptchaModule } from "ng-recaptcha";
import { RECAPTCHA_SETTINGS, RecaptchaSettings } from "ng-recaptcha";
import { RecaptchaFormsModule } from "ng-recaptcha/forms";
import { NgxSmartModalModule } from "ngx-smart-modal";
import { AuthGuardService } from "./_services/auth-guard.service";
import { AuthServiceService } from "./_services/authentication-service";
// MDB Angular Pro

import { MDBBootstrapModule } from "angular-bootstrap-md";
import { InternationalPhoneNumberModule } from "ngx-international-phone-number";

import {
  ButtonsModule,
  WavesModule,
  DropdownModule,
} from "angular-bootstrap-md";
import { operationLanguage } from "./_services/operationLanguage-service";
import { ToastrModule } from "ngx-toastr";
import { toasterService } from "./_services/toaster-service";
import { HttpService } from "./_services/HttpService";
import { NgxUiLoaderDemoService } from "./_services/ngx-ui-loader-demo.service";

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from "ngx-ui-loader";
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AgmCoreModule } from "@agm/core";
import { NgProgressModule } from "ngx-progressbar";
import { CustomValidation } from "./_services/custom-validator.service";
import { ChangePasswordComponent } from "./layouts/change-password/change-password.component";
import { ChangePasswordMasterComponent } from "./layouts/change-password-master/change-password-master.component";
import {
  CashInComponent,
  DialogContentDialog,
} from "./finance/cash-in/cash-in.component";
import {
  CashOutComponent,
  DialogContentDialog1,
} from "./finance/cash-out/cash-out.component";

import { FindAllLanguagesService } from "./_services/find-all-languages.service";
import { PayComponent } from "./bills/pay/pay.component";
import { InquiryComponent } from "./bills/inquiry/inquiry.component";
import { NgxPrintModule } from "ngx-print";
import { NgxQRCodeModule } from "ngx-qrcode2";
import { DialogContentDialog2 } from "./user-managment/create-wallet/create-wallet.component";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogContentDialog3 } from "./otc/otc.component";
// import { DatePipe } from "@angular/common";
import { SweetAlertToastService } from "./_services/sweet-alert-toast.service";
import { SharedService } from "./_services/shared-service";
import { Encryption } from "./_services/Encryption";

import { UserProfileComponent } from "./layouts/user-profile/user-profile.component";
import { UserIdleModule } from "angular-user-idle";
import { BulkAirTimeTopupComponent } from "./bulk-air-time-topup/bulk-air-time-topup.component";
import { FileUploadModule } from "ng2-file-upload";
import { BoaComponent } from "./boa/boa.component";
import { BulkSalaryComponent } from "./bulk-salary/bulk-salary.component";
import { CreditDialog } from "./branch-pages/branch-list/branchlist.component";
import { B2pTransferComponent } from "./b2p-transfer/b2p-transfer.component";
import { B2bTransferComponent } from "./b2b-transfer/b2b-transfer.component";
import { SellAirtimeTopUpComponent } from "./sell-airtime-top-up/sell-airtime-top-up.component";
import { ChangeSecurityQuestionComponent } from "./change-security-question/change-security-question.component";
import { DatePipe } from "@angular/common";
import { OtcSendComponent } from "./otc-send/otc-send.component";
import { OtcReceiveComponent } from "./otc-receive/otc-receive.component";
import { BranchTransactionsComponent } from "./branch-transactions/branch-transactions.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { PayBillComponent } from "./bills/pay-bill/pay-bill.component";
import { PaySchoolBillComponent } from "./bills/pay-school-bill/pay-school-bill.component";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { HttpClientService } from "./_services/HttpClientService";
import { ErrorHandling } from "./_services/ErrorHandling";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#f1ac1e",
  bgsOpacity: 0.5,
  bgsPosition: "bottom-right",
  bgsSize: 60,
  bgsType: "ball-spin-clockwise",
  blur: 9,
  fgsColor: "#f1ac1e",
  fgsPosition: "center-center",
  fgsSize: 20,
  fgsType: "ball-spin-clockwise",
  gap: 24,
  logoPosition: "center-center",
  logoSize: 120,
  logoUrl: "assets/images/gizaPay.png",
  masterLoaderId: "master",
  overlayBorderRadius: "0",
  overlayColor: "rgba(40, 40, 40, 0.9)",
  pbColor: "#f1ac1e",
  pbDirection: "ltr",
  pbThickness: 3,
  hasProgressBar: true,
  text: "",
  textColor: "#FFFFFF",
  textPosition: "center-center",
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DialogContentDialogBulkATT,
    ChangePasswordComponent,
    ChangePasswordMasterComponent,
    InquiryComponent,
    PayComponent,
    DialogContentDialog,
    DialogContentDialog1,
    DialogContentDialog2,
    DialogContentDialog3,
    DialogContentDialogBulkSU,
    UserProfileComponent,

    BulkAirTimeTopupComponent,
    BoaComponent,
    BulkSalaryComponent,
    B2pTransferComponent,
    B2bTransferComponent,
    SellAirtimeTopUpComponent,
    ChangeSecurityQuestionComponent,
    OtcSendComponent,
    OtcReceiveComponent,
    BranchTransactionsComponent,
    PayBillComponent,
    PaySchoolBillComponent
  ],
  imports: [
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: "rgba(0,0,0,0.1)",
      backdropBorderRadius: "3px",
      primaryColour: "#f1ac1e",
      secondaryColour: "#ffffff",
      tertiaryColour: "#ffffff",
    }),
    NgxDatatableModule,
    FileUploadModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatSidenavModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCardModule,
    DemoMaterialModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    FlexLayoutModule,
    PerfectScrollbarModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    MDBBootstrapModule.forRoot(),
    InternationalPhoneNumberModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule,
    AgmCoreModule.forRoot({
      apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
    }),
    NgProgressModule,
    NgxPrintModule,
    NgxQRCodeModule,
    MatDialogModule,
    // DatePipe
    UserIdleModule.forRoot({ idle: 600, timeout: 1, ping: 600 }),
    NgxMatSelectSearchModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true,
      deps:[ErrorHandling]
    },
    DatePipe,
    Encryption,
    operationLanguage,
    TranslateService,
    AuthGuardService,
    AuthServiceService,
    CookieService,
    toasterService,
    HttpService,
    HttpClientService,
    ErrorHandling,
    CustomValidation,
    NgxUiLoaderDemoService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: "6LdCGn0UAAAAADbW4LPKHMC1rQgUngJ6SSD9P_FH",
      } as RecaptchaSettings,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    FindAllLanguagesService,
    SweetAlertToastService,
    SharedService,
  ],
  entryComponents: [
    DialogContentDialog,
    DialogContentDialog1,
    DialogContentDialog2,
    DialogContentDialog3,
    DialogContentDialogBulkSU,
    DialogContentDialogBulkATT
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
