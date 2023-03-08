import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UpgradeComponent } from "./upgrade/upgrade.component";
import { KycComponent } from "./kyc/kyc.component";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "managment",
    pathMatch: "full",
  },
  {
    path: "",
    children: [
      {
        path: "create-wallet",
        component: CreateWalletComponent,
      },
      {
        path: "upgrade",
        component: UpgradeComponent,
      },
      {
        path: "kyc",
        component: KycComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagmentRoutingModule {}
