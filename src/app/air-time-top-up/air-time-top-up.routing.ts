import { Routes } from "@angular/router";
import { BulkAirTimeTopupComponent } from "./bulk-air-time-topup/bulk-air-time-topup.component";
import { SellAirtimeTopUpComponent } from "./sell-airtime-top-up/sell-airtime-top-up.component";

export const airTimeTopRouter : Routes = [
    {
        path: "bulk-air-time-topup",
        component: BulkAirTimeTopupComponent,
    },
    {
        path: "sell-airtime-top-up",
        component: SellAirtimeTopUpComponent,
    },
]