import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  CreateCustomerComponent,
  DialogContentDialog2,
} from "./create-customer/create-customer.component";
import { RouterModule } from "@angular/router";
import { CustomerManagementNewRoutes } from "./customer-management-new.routing";
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule,
} from "@angular/material";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { UpgradeLevelNewComponent } from "./upgrade-level-new/upgrade-level-new.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { CustomersListComponent } from './customers-list/customers-list.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    CreateCustomerComponent,
    DialogContentDialog2,
    UpgradeLevelNewComponent,
    CustomersListComponent,
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
    MatIconModule,
    FileUploadModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
    CommonModule,
    RouterModule.forChild(CustomerManagementNewRoutes),
    MatStepperModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  providers: [TranslateService],
  entryComponents: [DialogContentDialog2],
})
export class CustomerManagementNewModule {}
