import { Routes } from "@angular/router";
import { CreateCustomerComponent } from "./create-customer/create-customer.component";
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { UpgradeLevelNewComponent } from "./customer-upgrade-level/customer-upgrade-level.component";
import { CustomerManagmentComponent } from "./customer-managment/customer-managment.component";

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
  {
    path: "customer-managment",
    component: CustomerManagmentComponent,
  },
];

