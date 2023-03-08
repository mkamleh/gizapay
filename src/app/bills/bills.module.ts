/** @format */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BillsRoutingModule } from "./bills-routing.module";
import { InquiryComponent } from "./inquiry/inquiry.component";
import { PayComponent } from "./pay/pay.component";
import { SharedService } from "../_services/shared-service";

@NgModule({
  declarations: [],
  imports: [CommonModule, BillsRoutingModule],
  providers: [SharedService],
})
export class BillsModule {}
