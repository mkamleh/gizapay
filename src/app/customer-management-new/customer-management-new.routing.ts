import { Routes } from "@angular/router";
import { CreateCustomerComponent } from "./create-customer/create-customer.component";
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { UpgradeLevelNewComponent } from "./upgrade-level-new/upgrade-level-new.component";

export const CustomerManagementNewRoutes: Routes = [
  {
    path: "create-customer",
    component: CreateCustomerComponent,
  },
  {
    path: "upgrade-level",
    component: UpgradeLevelNewComponent,
  },
  {
    path: "customer-list",
    component: CustomersListComponent,
  },
];
