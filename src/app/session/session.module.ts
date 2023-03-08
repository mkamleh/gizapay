/** @format */

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatButtonModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatSelectModule,
  MatTooltipModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import { SessionRoutes } from "./session.routing";
import { RecaptchaModule } from "ng-recaptcha";
import { NgxSmartModalModule } from "ngx-smart-modal";
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule, Http } from "@angular/http";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { SharedModule } from "app/shared/shared.module";
import { LoginSignupComponent } from "./login-signup/login-signup.component";
import { NgProgressModule } from "ngx-progressbar";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { AnswerSecurityQuestionsComponent } from "./answer-security-questions/answer-security-questions.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule.forChild(SessionRoutes),
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSelectModule,
    FlexLayoutModule,
    RecaptchaModule,
    NgxSmartModalModule.forChild(),
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient]
    //   }
    // }),
    HttpModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    NgProgressModule,
    MatTooltipModule,
  ],
  providers: [TranslateService],
  declarations: [
    LoginSignupComponent,
    AnswerSecurityQuestionsComponent,
    ForgotPasswordComponent,
  ],
})
export class SessionModule {}
