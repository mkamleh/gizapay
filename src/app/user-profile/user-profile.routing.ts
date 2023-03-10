import { Routes } from "@angular/router";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ChangePasswordMasterComponent } from "./change-password-master/change-password-master.component";
import { ChangeSecurityQuestionComponent } from "app/user-profile/change-security-question/change-security-question.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";

export const userProfileRoutes: Routes = [
    {
        path:"",
        component:UserProfileComponent
    },
    {
        path:"change-password-master",
        component:ChangePasswordMasterComponent
    },
    {
        path: "change-password",
        component: ChangePasswordComponent
    },
    {
        path:"change-security-question",
        component:ChangeSecurityQuestionComponent
    }
]