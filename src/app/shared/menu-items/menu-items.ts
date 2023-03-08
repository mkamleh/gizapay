/** @format */

import { Injectable } from "@angular/core";

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS_MASTER: Menu[] = [
  {
    state: "home",
    name: "HOME",
    type: "link",
    icon: "dashboard",
  },
  // {
  //   state: "branch",
  //   name: "branch_management",
  //   type: "link",
  //   icon: "grain",
  // },
  {
    state: "customer",
    name: "Customer Management",
    type: "sub",
    icon: "group_add",
    children: [
      { state: "create-customer", name: "Create Customer" },
      { state: "upgrade-level", name: "level_upgrade" },
      { state: "customer-managment", name: "customers-management" },
      { state: "customer-list", name: "customers-list" },
    ],
  },
  {
    state: "transfer",
    name: "TRANSFER",
    type: "sub",
    icon: "swap_horiz",
    children: [
      { state: "b2p-transfer", name: "b2p-transfer" },
      { state: "b2b-transfer", name: "b2b-transfer" },
      { state: "transfer-to-cbs", name: "transfer-to-cbs" },
      { state: "bulk-salary-upload", name: "bulk-salary-upload" },
    ],
  },
  {
    state: "finance",
    name: "Finance",
    type: "sub",
    icon: "account_balance_wallet",
    children: [
      { state: "cash-in", name: "cash_in" },
      { state: "cash-out", name: "cash_out" },
      { state: "qr-voucher", name: "QR_voucher" },
    ],
  },
  {
    state: "otc",
    name: "otc",
    type: "sub",
    icon: "send_to_mobile",
    children: [
      { state: "otc-send", name: "otc-send" },
      { state: "otc-receive", name: "otc-receive" },
    ],
  },
  {
    state: "pay-school-bill",
    name: "Pay School bill",
    type: "link",
    icon: "receipt"
    // badge: [{ type: "red", value: "3" }]
  },
  // {
  //   state: "bank",
  //   name: "Bank",
  //   type: "sub",
  //   icon: "link",
  //   children: [
  //     { state: "link-t24-account", name: "link_t24_account" },
  //     { state: "load-money", name: "load_money" },
  //   ],
  // },
  {
    state: "load-money",
    name: "load_money",
    type: "link",
    icon: "monetization_on",
  },
  {
    state: "pay-bill",
    name: "pay",
    type: "link",
    icon: "receipt",
  },
  // {
  //   state: "otc",
  //   name: "otc",
  //   type: "link",
  //   icon: "account_balance",
  // },
  // {
  //   state: "bills",
  //   name: "Bills",
  //   type: "sub",
  //   icon: "receipt",
  //   children: [
  //     { state: "inquiry", name: "inquiry" },
  //     { state: "pay", name: "pay" },
  //   ],
  // },
  {
    state: "air-time-topup",
    name: "airtime-top-up",
    type: "sub",
    icon: "airplay",
    children: [
      { state: "sell-airtime-top-up", name: "sell-airtime-top-up" },
      { state: "bulk-air-time-topup", name: "bulk-air-time-topup" },
    ],
  },
  {
    state: "reports",
    name: "Reports",
    type: "sub",
    icon: "library_books",
    children: [
      { state: "wallet-report", name: "Transaction_Report" },
      { state: "qr-report", name: "QR_report" },
      { state: "otc-report", name: "otc_report" },
    ],
  },
  // {
  //   state: "user-pages-master",
  //   name: "User Managment",
  //   type: "link",
  //   icon: "person",
  // },
  // {
  //   state: "customer-managment",
  //   name: "Customer Managementment",
  //   type: "link",
  //   icon: "people",
  // },
  // {
  //   state: "bulk-air-time-topup",
  //   name: "bulk-air-time-topup",
  //   type: "link",
  //   icon: "airplay",
  // },
  // {
  //   state: "bulk-salary-upload",
  //   name: "bulk-salary-upload",
  //   type: "link",
  //   icon: "airplay",
  // },
  // {
  //   state: "sell-airtime-top-up",
  //   name: "sell-airtime-top-up",
  //   type: "link",
  //   icon: "airplay",
  // },
];
const MENUITEMS_ADMIN: Menu[] = [
  {
    state: "home",
    name: "HOME",
    type: "link",
    icon: "dashboard",
  },
  {
    state: "transfer",
    name: "TRANSFER",
    type: "sub",
    icon: "swap_horiz",
    children: [
      { state: "b2p-transfer", name: "b2p-transfer" },
      { state: "b2b-transfer", name: "b2b-transfer" },
      { state: "transfer-to-cbs", name: "transfer-to-cbs" },
      { state: "bulk-salary-upload", name: "bulk-salary-upload" },
    ],
  },
  {
    state: "finance",
    name: "Finance",
    type: "sub",
    icon: "account_balance_wallet",
    children: [
      { state: "cash-in", name: "cash_in" },
      { state: "cash-out", name: "cash_out" },
      { state: "qr-voucher", name: "QR_voucher" },
    ],
  },
  {
    state: "otc",
    name: "otc",
    type: "sub",
    icon: "send_to_mobile",
    children: [
      { state: "otc-send", name: "otc-send" },
      { state: "otc-receive", name: "otc-receive" },
    ],
  },
  // {
  //   state: "bank",
  //   name: "Bank",
  //   type: "sub",
  //   icon: "bank",
  //   children: [
  //     { state: "link-t24-account", name: "link_t24_account" },
  //     { state: "load-money", name: "load_money" },
  //   ],
  // },
  // {
  //   state: "load-money",
  //   name: "load_money",
  //   type: "link",
  //   icon: "monetization_on",
  // },
  // {
  //   state: "otc",
  //   name: "otc",
  //   type: "link",
  //   icon: "Otc",
  // },
  {
    state: "customer",
    name: "Customer Management",
    type: "sub",
    icon: "group_add",
    children: [
      { state: "create-customer", name: "create-customer" },
      { state: "upgrade-level", name: "upgrade-customer" },
      { state: "customer-managment", name: "customers-management" },
      { state: "customer-list", name: "customers-list" },
    ],
  },
  {
    state: "bills",
    name: "Bills",
    type: "sub",
    icon: "payment",
    children: [
      { state: "inquiry", name: "inquiry" },
      { state: "pay", name: "pay" },
    ],
  },
  {
    state: "air-time-topup",
    name: "airtime-top-up",
    type: "sub",
    icon: "airplay",
    children: [
      { state: "sell-airtime-top-up", name: "sell-airtime-top-up" },
      { state: "bulk-air-time-topup", name: "bulk-air-time-topup" },
    ],
  },
  {
    state: "reports",
    name: "Reports",
    type: "sub",
    icon: "library_books",
    children: [
      { state: "wallet-report", name: "Transaction_Report" },
      { state: "qr-report", name: "QR_report" },
      { state: "otc-report", name: "otc_report" },
    ],
  },
  // {
  //   state: "user-pages",
  //   name: "User Managment",
  //   type: "link",
  //   icon: "person",
  // },
  // {
  //   state: "customer-managment",
  //   name: "Customer Managementment",
  //   type: "link",
  //   icon: "people",
  // },
];

const MENUITEMS_NORMAL: Menu[] = [
  {
    state: "home",
    name: "HOME",
    type: "link",
    icon: "dashboard",
  },
  {
    state: "transfer",
    name: "TRANSFER",
    type: "sub",
    icon: "swap_horiz",
    children: [
      { state: "b2p-transfer", name: "b2p-transfer" },
      { state: "b2b-transfer", name: "b2b-transfer" },
      { state: "transfer-to-cbs", name: "transfer-to-cbs" },
      { state: "bulk-salary-upload", name: "bulk-salary-upload" },
    ],
  },
  {
    state: "finance",
    name: "Finance",
    type: "sub",
    icon: "account_balance_wallet",
    children: [
      { state: "cash-in", name: "cash_in" },
      { state: "cash-out", name: "cash_out" },
      { state: "qr-voucher", name: "QR_voucher" },
    ],
  },
  {
    state: "otc",
    name: "otc",
    type: "sub",
    icon: "send_to_mobile",
    children: [
      { state: "otc-send", name: "otc-send" },
      { state: "otc-receive", name: "otc-receive" },
    ],
  },
  // {
  //   state: "otc",
  //   name: "otc",
  //   type: "link",
  //   icon: "Otc",
  // },
  {
    state: "customer",
    name: "Customer Management",
    type: "sub",
    icon: "group_add",
    children: [
      { state: "create-customer", name: "Create Customer" },
      { state: "upgrade-level", name: "level_upgrade" },
      { state: "customer-managment", name: "customers-management" },
      { state: "customer-list", name: "customers-list" },
    ],
  },
  {
    state: "bills",
    name: "Bills",
    type: "sub",
    icon: "payment",
    children: [
      { state: "inquiry", name: "inquiry" },
      { state: "pay", name: "pay" },
    ],
  },
  {
    state: "air-time-topup",
    name: "airtime-top-up",
    type: "sub",
    icon: "airplay",
    children: [
      { state: "sell-airtime-top-up", name: "sell-airtime-top-up" },
      { state: "bulk-air-time-topup", name: "bulk-air-time-topup" },
    ],
  },
  {
    state: "reports",
    name: "Reports",
    type: "sub",
    icon: "library_books",
    children: [
      { state: "wallet-report", name: "Transaction_Report" },
      { state: "qr-report", name: "QR_report" },
      { state: "otc-report", name: "otc_report" },
    ],
  },
];

@Injectable()
export class MenuItems {
  getMaster(): Menu[] {
    return MENUITEMS_MASTER;
  }

  getAdmin(): Menu[] {
    return MENUITEMS_ADMIN;
  }

  getNormal(): Menu[] {
    return MENUITEMS_NORMAL;
  }

  addMaster(menu: Menu) {
    MENUITEMS_MASTER.push(menu);
  }

  addAdmin(menu: Menu) {
    MENUITEMS_ADMIN.push(menu);
  }

  addNormal(menu: Menu) {
    MENUITEMS_NORMAL.push(menu);
  }
}
