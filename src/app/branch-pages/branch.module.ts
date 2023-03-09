/** @format */

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatProgressBarModule,
  MatMenuModule,
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

import {
  BranchListComponent,
  CreditDialog,
  DebitDialog,
} from "./branch-list/branchlist.component";

import { BranchRoutes } from "./branch.routing";
import { SharedModule } from "app/shared/shared.module";
import { ChartsModule } from "angular-bootstrap-md";
import { DemoMaterialModule } from "app/shared/demo.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgProgressModule } from "ngx-progressbar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(BranchRoutes),
    MatIconModule,
    SharedModule,
    FlexLayoutModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule,
    NgxChartsModule,
    NgxDatatableModule,
    NgProgressModule,
  ],
  declarations: [BranchListComponent, CreditDialog, DebitDialog],
  entryComponents: [CreditDialog, DebitDialog],
})
export class BranchModule {}
