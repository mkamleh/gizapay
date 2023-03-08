/** @format */

import { Routes } from "@angular/router";

import { LoginSignupComponent } from "./login-signup/login-signup.component";
import { AnswerSecurityQuestionsComponent } from "./answer-security-questions/answer-security-questions.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

export const SessionRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "",
    children: [
      {
        path: "login-signup",
        component: LoginSignupComponent,
      },
      {
        path: "security-questions",
        component: AnswerSecurityQuestionsComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
    ],
  },
];
