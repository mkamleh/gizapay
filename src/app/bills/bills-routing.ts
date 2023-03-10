import { Routes} from "@angular/router";
import { PayBillComponent } from "./pay-bill/pay-bill.component";
import { PaySchoolBillComponent } from "./pay-school-bill/pay-school-bill.component";
import { LoadMoneyComponent } from "./load-money/load-money";

export const billsRoutes: Routes = [
  {
    path: "pay-bill",
    component: PayBillComponent,
  },
  {
    path: "pay-school-bill",
    component: PaySchoolBillComponent,
  },
  {
    path: "load-money",
    component: LoadMoneyComponent,
  },
];

