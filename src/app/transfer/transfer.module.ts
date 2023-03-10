import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { transferRouters } from "./transfer.routing";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgModule } from "@angular/core";
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatStepperModule, MatCardModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatIconModule } from "@angular/material";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { BoaComponent } from "./boa/boa.component";
import { BulkSalaryComponent } from "./bulk-salary/bulk-salary.component";
import { B2pTransferComponent } from "./b2p-transfer/b2p-transfer.component";
import { B2bTransferComponent } from "./b2b-transfer/b2b-transfer.component";
import { FileUploadModule } from "ng2-file-upload";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
  
  export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations :[
        BoaComponent,
        BulkSalaryComponent,
        B2pTransferComponent,
        B2bTransferComponent,
        
    ],
    imports: [
        FormsModule,
        MatButtonModule,
        MatIconModule,
        FileUploadModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule,
        CommonModule,
        RouterModule.forChild(transferRouters),
        MatStepperModule,
        MatCardModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,],
    providers: [TranslateService],
    entryComponents:[]
})

export class transferModule {}