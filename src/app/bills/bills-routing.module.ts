import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsRoutingModule {}
