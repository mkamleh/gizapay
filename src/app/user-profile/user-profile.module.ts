import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgModule } from "@angular/core";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ChangeSecurityQuestionComponent } from "app/user-profile/change-security-question/change-security-question.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { userProfileRoutes } from "./user-profile.routing";
import { ChangePasswordMasterComponent } from "./change-password-master/change-password-master.component";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations :[
        UserProfileComponent,
        ChangePasswordComponent,
        ChangePasswordMasterComponent,
        ChangeSecurityQuestionComponent
    ],
    imports: [
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule,
        CommonModule,
        RouterModule.forChild(userProfileRoutes),
        MatStepperModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
    ],
    providers: [TranslateService],
    entryComponents:[]
})

export class userProfileModule {}