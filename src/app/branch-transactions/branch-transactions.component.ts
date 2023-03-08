import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgxSmartModalService } from "ngx-smart-modal";
import { TooltipPosition } from "@angular/material";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CustomValidation } from "app/_services/custom-validator.service";

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import Swal from "sweetalert2";
import { Encryption } from "app/_services/Encryption";
import { toasterService } from "app/_services/toaster-service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-branch-transactions",
  templateUrl: "./branch-transactions.component.html",
  styleUrls: ["./branch-transactions.component.scss"],
})
export class BranchTransactionsComponent implements OnInit {
  showLucyPayForm: boolean = true;

  pageTitle: string = "otc_report";

  amountForm: FormGroup;
  walletForm: FormGroup;
  showMalForm: boolean = true;
  showBankForm: boolean = true;
  lucyPayMsg: boolean = false;
  BoaMsg: boolean = false;
  OtcMsg: boolean = false;
  page1: number = 0;
  page2: number = 0;
  transactions: any = [];
  showRecivedTransactions: boolean = false;
  error: any;
  walletId: any;
  showWalletError: boolean = false;
  beneficiary: any;
  isBenfExist: boolean = false;
  isBankBenfExist: boolean = false;
  isBankOTCExist: boolean = false;
  transferFees: any;
  transferFeesOTC: any;
  showFees: boolean = false;
  showFeesBank: boolean = false;
  showFeesOTC: boolean = false;
  selectedTransferedValue: any;
  modal: boolean = false;
  modalBank: boolean = false;
  modalOTC: boolean = false;
  bankForm: FormGroup;
  addBeneForm: FormGroup;
  otcForm: FormGroup;
  otcAddBeneForm: FormGroup;
  showAddBeneficiary: boolean = false;
  showAddBeneficiaryOTC: boolean = false;
  inquire: boolean = false;
  beneficiaries: any[];
  beneficiariesOTC: any[];
  idTypes: any[];
  branchTransactions: any[] = [];
  beneficiariesList: any[] = [
    {
      id: 1,
      code: "SA1122334455667",
      owner: "وداد الغامدي",
      country: "KSA",
    },
    {
      id: 2,
      code: "SA1122334455667",
      owner: "عبدالله السدحان",
      country: "KSA",
    },
    {
      id: 3,
      code: "SA1122334455667",
      owner: "حمد الشهري",
      country: "KSA",
    },
    {
      id: 4,
      code: "SA1122334455667",
      owner: "نواف التمياط",
      country: "KSA",
    },
    {
      id: 4,
      code: "SA1122334455667",
      owner: "سلمان التركي",
      country: "KSA",
    },
    {
      id: 6,
      code: "SA1122334455667",
      owner: "محمد نواف",
      country: "KSA",
    },
    {
      id: 7,
      code: "SA1122334455667",
      owner: "سلطان الغامدي",
      country: "KSA",
    },
    {
      id: 8,
      code: "SA1122334455667",
      owner: "ساره الشهري",
      country: "KSA",
    },
    {
      id: 9,
      code: "SA1122334455667",
      owner: "حلا الشلهوب",
      country: "KSA",
    },
  ];
  addedBeneficiaryName: any;
  addedBeneficiaryIban: any;
  // ToolTip
  position: TooltipPosition = "below";
  message: string = "Add new beneficiary";
  tooltips: string[] = [];
  disabled = false;
  showDelay = 0;
  hideDelay = 1000;
  showExtraClass = false;
  layoutDir = "ltr";

  // private request_options: any = {
  //   method: "",
  //   path: "",
  //   body: "",
  // };
  inquiredBeneficiary: any;

  showOTPForm_LucyPay: boolean = false;
  showOTPForm_BOA: boolean = false;
  showOTPForm_OTC: boolean = false;

  sendToBankAccount: boolean = false; // not registered beneficiary

  timeLeft: number = 60;
  interval: any;
  page = 0;
  activePage = 0;
  pages = [];
  pageSize = 10;
  activePage2 = 0;
  pageSize2 = 10;
  count = 50;
  offset = 0;
  rows: any = [];
  temp: any = [];

  public config: PerfectScrollbarConfigInterface = {};
  lucyPayAmount: any;
  LucyPaywalletNumber: string;
  boaAmount: any;
  boaAccountNumber: string;
  otcAmount: any;
  otcBene: any;

  form: FormGroup;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    public authService: AuthServiceService,
    public adminLayout: AdminLayoutComponent,
    public fb: FormBuilder,
    public findAllLanguagesService: FindAllLanguagesService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private _sharedService: SharedService,
    public findLanguages: FindAllLanguagesService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);

    // let WalletResourcesArray = this.adminLayout.getWalletId();
    this.walletId = this.cookieService.get("walletId");
  }

  ngOnInit() {
    this.loadForm();
    this.getBranchTransactions(this.offset);
  }

  loadForm() {
    this.form = this.fb.group({
      dateFrom: [null],
      dateTo: [null],
      amount: [
        null,
        Validators.compose([
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
    });
  }

  getBranchTransactions(page) {
    // Getting last 10 transactions
    let token = this.cookieService.get("agt_token");
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    let fromDate = null;
    if (this.form.value.dateFrom != null) {
      fromDate = this.formatDate(new Date(this.form.value.dateFrom));
    } else {
      fromDate = null;
    }

    let toDate = null;
    if (this.form.value.dateTo != null) {
      toDate = this.formatDate(new Date(this.form.value.dateTo));
    } else {
      toDate = null;
    }

    let amount = null;
    if (this.form.value.amount != null) {
      amount = this.form.value.amount;
    } else {
      amount = null;
    }

   
    let SERVICE_PARAM =
      `fromDate=${fromDate}&toDate=${toDate}&amount=${amount}` +
      "&page=" +
      page +
      "&size=" +
      this.pageSize;
  
    this.httpClientService.httpClientMainRouter("WRMAL_471",SERVICE_PARAM,"GET")
      .subscribe( res=>{
        let transactionsObj: any = this.encryption.decrypt(res);
        let detailedRrows = transactionsObj.body.pageList;
        this.count = transactionsObj.body.count;
        // push our inital complete list
        console.log("response", detailedRrows);
        this.rows = detailedRrows.map((item) => {
          return {
            date: this.parseDate(item.data),
            amount: item.amount,
            statusCode: item.statusCode,
            internalReferance: item.internalReferance,
            receiverName: item.receiverName,
            senderName: item.senderName,
            statusCaption: item.statusCaption,
          };
        });

        // cache our list
      },err =>{
      });
  }
  parseDate(date) {
    let dayOfMonth = date.dayOfMonth.toString();

    if (dayOfMonth.length < 2) {
      dayOfMonth = "0" + dayOfMonth;
    }

    let monthValue = date.monthValue.toString();
    if (monthValue.length < 2) {
      monthValue = "0" + monthValue;
    }

    let hour = date.hour.toString();

    if (hour.length < 2) {
      hour = "0" + hour;
    }

    let minute = date.minute.toString();
    if (minute.length < 2) {
      minute = "0" + minute;
    }

    let second = date.second.toString();
    if (second.length < 2) {
      second = "0" + second;
    }

    let year = date.year;

    return (
      dayOfMonth + "-" + monthValue + "-" + year + " " + hour + ":" + minute
    );
  }
  onPage(event) {
    console.log("Page Event", event);
    this.getBranchTransactions(event.offset);
  }

  formatDate(date) {
    var monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    if (day <= 9) {
      return (
        year + "-" + monthNames[monthIndex] + "-" + "0" + day + "T00:00:00"
      );
    } else {
      return year + "-" + monthNames[monthIndex] + "-" + day + "T00:00:00";
    }
  }
}
