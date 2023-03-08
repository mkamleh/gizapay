/** @format */

import { NgModule } from "@angular/core";

import { MenuItems } from "./menu-items/menu-items";
import { HorizontalMenuItems } from "./menu-items/horizontal-menu-items";
import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective,
} from "./accordion";
import { ToggleFullscreenDirective } from "./fullscreen/toggle-fullscreen.directive";
import { Http } from "@angular/http";
import { MatSelectModule } from "@angular/material/select";

import { QRCodeModule } from "angularx-qrcode";
import { NgxPrintModule } from "ngx-print";
import {
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatListModule,
  MatGridListModule,
  MatMenuModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatTabsModule,
  MatExpansionModule,
  MatDialogModule,
  MatRadioModule,
} from "@angular/material";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { NgxSmartModalModule } from "ngx-smart-modal";
import { ToastrModule } from "ngx-toastr";
import { InternationalPhoneNumberModule } from "ngx-international-phone-number";

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule,
} from "ngx-ui-loader";
import { NgxUiLoaderDemoService } from "app/_services/ngx-ui-loader-demo.service";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AgmCoreModule } from "@agm/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgProgressModule } from "ngx-progressbar";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "white",
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomCenter,
  // bgsSize: 60,
  // bgsType: SPINNER.rectangleBounce,
  fgsColor: "white",
  // fgsPosition: POSITION.centerCenter,
  // fgsSize: 60,
  // fgsType: SPINNER.chasingDots,
  // logoUrl: 'assets/angular.png',
  pbColor: "white",
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ToastrModule.forRoot(),
    MatSelectModule,
    QRCodeModule,
    NgxPrintModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatDialogModule,
    MDBBootstrapModule,
    InternationalPhoneNumberModule,
    NgxSmartModalModule.forRoot(),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB0f7JNwgtUrJNKjml0VX37aKCxRkE084M",
    }),
    ReactiveFormsModule,
    FormsModule,
    MatRadioModule,
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    MatSelectModule,
    QRCodeModule,
    NgxPrintModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatTabsModule,
    MatExpansionModule,
    MatDialogModule,
    MDBBootstrapModule,
    NgxSmartModalModule,
    InternationalPhoneNumberModule,
    ToastrModule,
    NgxUiLoaderModule,
    TranslateModule,
    AgmCoreModule,
    NgProgressModule,
  ],
  providers: [MenuItems, HorizontalMenuItems, NgxUiLoaderDemoService],
})
export class SharedModule {}
