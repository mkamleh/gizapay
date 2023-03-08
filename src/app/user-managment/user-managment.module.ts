/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserManagmentRoutingModule } from "./user-managment-routing.module";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";
import { UpgradeComponent } from "./upgrade/upgrade.component";
import { KycComponent } from "./kyc/kyc.component";
import { MatDatepickerModule, MatRadioModule } from "@angular/material";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";

@NgModule({
  declarations: [CreateWalletComponent, UpgradeComponent, KycComponent],
  imports: [
    CommonModule,
    UserManagmentRoutingModule,
    MatDatepickerModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    MatRadioModule,
  ],
})
export class UserManagmentModule {}
