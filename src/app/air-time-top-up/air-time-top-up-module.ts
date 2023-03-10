import { NgModule } from "@angular/core";
import { BulkAirTimeTopupComponent } from "./bulk-air-time-topup/bulk-air-time-topup.component";
import { SellAirtimeTopUpComponent } from "./sell-airtime-top-up/sell-airtime-top-up.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule } from "@angular/material";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { userProfileRoutes } from "app/user-profile/user-profile.routing";
import { HttpClient } from "@angular/common/http";
import { airTimeTopRouter } from "./air-time-top-up.routing";
import { FileUploadModule } from "ng2-file-upload";


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations:[
        BulkAirTimeTopupComponent,
        SellAirtimeTopUpComponent
    ],
    imports:[
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule,
        FileUploadModule,
        CommonModule,
        RouterModule.forChild(airTimeTopRouter),
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

export class airTimePopupModule {}