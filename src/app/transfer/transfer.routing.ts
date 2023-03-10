import { Routes } from "@angular/router";
import { B2pTransferComponent } from "./b2p-transfer/b2p-transfer.component";
import { BoaComponent } from "./boa/boa.component";
import { BulkSalaryComponent } from "./bulk-salary/bulk-salary.component";
import { B2bTransferComponent } from "./b2b-transfer/b2b-transfer.component";

export const transferRouters : Routes = [
    {
        path:"b2p-transfer",
        component: B2pTransferComponent
    },
    {
        path:"transfer-to-cbs",
        component: BoaComponent,
    },
    {
        path:"b2b-transfer",
        component: B2bTransferComponent
    },
    {
        path: "bulk-salary-upload",
        component: BulkSalaryComponent,
    },

]