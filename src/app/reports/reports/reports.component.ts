/** @format */

import { Component, OnInit } from "@angular/core";
import { single, multi } from "./charts.data";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import swal from "sweetalert2";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  page = 0;
  count = 50;
  offset = 0;
  rows: any;
  temp: any = [];
  error: any;
  wallets: any;
  pageTitle: string = "Wallet_Report";
  showErrorMsg: boolean;
  errorMsg: any;
  layoutDir: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  form: FormGroup;
  transactionTypes: any[] = [];
  constructor(
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private httpService: HttpService,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    private cookieService: CookieService,
    public fb: FormBuilder,
    private httpClientService: HttpClientService,
    public ngProgress: NgProgress
  ) {
    this._sharedService.emitChange(this.pageTitle);
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    this.AgentBalance();
    // this.getWallets(0);
    this.loadForm();
    this.getTransactionTypes();
  }

  loadForm() {
    this.form = this.fb.group({
      dateFrom: [null],
      dateTo: [null],
      txnTypeCode: [null],
      amount: [
        null,
        Validators.compose([
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      mobileNo: [
        "",
        Validators.compose([
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
    });
  }

  headerParam(): string {
    let walletId = this.wallets[0].id;

    let param = "walletId=" + walletId + "&";
    if (this.form.value.dateFrom != null) {
      param =
        param +
        "fromDate=" +
        this.formatDate(new Date(this.form.value.dateFrom)) +
        "&";
    }
    if (this.form.value.dateTo != null) {
      param =
        param +
        "toDate=" +
        this.formatDate(new Date(this.form.value.dateTo)) +
        "&";
    }
    if (this.form.value.txnTypeCode != null) {
      param = param + "txnTypeCode=" + this.form.value.txnTypeCode + "&";
    }
    if (this.form.value.amount != null) {
      param = param + "amount=" + this.form.value.amount + "&";
    }

    if (param.endsWith("&")) {
      param = param.slice(0, -1);
    }
    console.log("param");

    return param;
  }
  async search(page) {
    let txnTypeCode = null;
    if (this.form.value.txnTypeCode != null) {
      txnTypeCode = this.form.value.txnTypeCode;
    } else {
      txnTypeCode = "";
    }
    let amount = null;
    if (this.form.value.amount != null) {
      amount = this.form.value.amount;
    } else {
      amount = null;
    }
    let fromDate = null;
    if (this.form.value.dateFrom != null) {
      fromDate = this.formatDate(new Date(this.form.value.dateFrom));
    } else {
      fromDate = "";
    }

    let toDate = null;
    if (this.form.value.dateTo != null) {
      toDate = this.formatDate(new Date(this.form.value.dateTo));
    } else {
      toDate = "";
    }
    if (amount || txnTypeCode || this.wallets || (fromDate && toDate)) {
      let SERVICE_PARAM = 
        `walletId=${this.wallets[0].id}&fromDate=${fromDate}&toDate=${toDate}&amount=${amount}&txnTypeCode=${txnTypeCode}&page=${page}&size=10`;
      this.httpClientService.httpClientMainRouter("WRMAL_472",SERVICE_PARAM,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res)
        let detailedRrows = response.body.pageList;
        this.count = response.body.count;
        // push our inital complete list
        this.rows = detailedRrows.map((item) => {
          return {
            amount: item.amount,
            date: this.parseDate(item.date),
            destinationWalletCode: item.destinationWalletCode,
            externalReference: item.externalReference
              ? item.externalReference
              : "___",
            internalReferance: item.internalReferance,
            statusCaption: item.statusCaption,
            statusCode: item.statusCode,
            transactionTypeCaption: item.transactionTypeCaption,
            flow: item.moneyFlow,
            sourceWalletCode: item.sourceWalletCode,
          };
        });

        // cache our list
        this.temp = [...this.rows];       
      },err =>{
        console.log(err)
      });
    } else {
      if (toDate && fromDate) {
        console.log("im heeeeeeeeeeeeeere");
      }
      swal({
        title: "Please fill all fields",
        text: "Make sure that you filled all field to search for your request",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, i got it!",
        cancelButtonText: await this.findAllLanguagesService.getTranslate(
          "cancel"
        ),
      });
    }
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
        year + "-" + monthNames[monthIndex] + "-" + "0" + day + "T" + "00:00:00"
      );
    } else {
      return year + "-" + monthNames[monthIndex] + "-" + day + "T" + "00:00:00";
    }
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
      // dayOfMonth + "-" + monthValue + "-" + year + " " + hour + ":" + minute
      year +
      "-" +
      monthValue +
      "-" +
      dayOfMonth +
      "T" +
      hour +
      "" +
      hour +
      "-" +
      minute +
      "-00"
    );
  }

  onPage(event) {
    console.log("Page Event", event);
    this.getWallets(event.offset);
    // this.page(event.offset, event.limit);
  }
  AgentBalance() {
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET")
      .subscribe( async res => {
        this.wallets = this._sharedService.decrypt(res).body;
        if (this.wallets[0].id) {
          await this.getWallets(this.offset);
        }
      },err =>{
        console.log(err)
      });
  }

  async getWallets(page) {
    let txnTypeCode = null;
    if (this.form.value.txnTypeCode != null) {
      txnTypeCode = this.form.value.txnTypeCode;
    } else {
      txnTypeCode = "";
    }
    let amount = null;
    if (this.form.value.amount != null) {
      amount = this.form.value.amount;
    } else {
      amount = "";
    }
    let fromDate = null;
    if (this.form.value.dateFrom != null) {
      fromDate = this.formatDate(new Date(this.form.value.dateFrom));
    } else {
      fromDate = "";
    }

    let toDate = null;
    if (this.form.value.dateTo != null) {
      toDate = this.formatDate(new Date(this.form.value.dateTo));
    } else {
      toDate = "";
    }
    if (this.wallets) {
      let SERVICE_PARAM = 
        `walletId=${this.wallets[0].id}&page=${page}&size=10`;
      this.httpClientService.httpClientMainRouter("WRMAL_472",SERVICE_PARAM,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res);
        let detailedRrows = response.body.pageList;
        this.count = response.body.count;
        // push our inital complete list
        console.log("detailedRrowsThatIwant", detailedRrows);

        this.rows = detailedRrows.map((item) => {
          return {
            amount: item.amount,
            date: this.parseDate(item.date),
            destinationWalletCode: item.destinationWalletCode,
            externalReference: item.externalReference
              ? item.externalReference
              : "___",
            internalReferance: item.internalReferance,
            statusCaption: item.statusCaption,
            statusCode: item.statusCode,
            transactionTypeCaption: item.transactionTypeCaption,
            flow: item.moneyFlow,
            sourceWalletCode: item.sourceWalletCode,
          };
        });

        // cache our list
        this.temp = [...this.rows];
        
      },err =>{
        console.log(err)
      });
    }
  }
  updateFilter(event) {
    const val = event.target.value;
    // filter our data
    const temp = this.temp.filter((d) => {
      return (
        d.inRef.indexOf(val) !== -1 ||
        !val ||
        d.exRef.indexOf(val) !== -1 ||
        !val ||
        d.wallet1.indexOf(val) !== -1 ||
        !val ||
        d.type1.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.agtName1.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.amount1.indexOf(val) !== -1 ||
        !val ||
        d.amount2.indexOf(val) !== -1 ||
        !val ||
        d.fees1.indexOf(val) !== -1 ||
        !val ||
        d.status1.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.date1.indexOf(val) !== -1 ||
        !val ||
        d.flow.indexOf(val) !== -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
    console.log("this.rows", this.rows);
  }

  ExcelExport() {
    this.httpClientService.httpClientMainRouter("WRMAL_329",this.headerParam(),"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res);
        var blob = new Blob([this.s2ab(atob(response.body))], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
        });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        let fileName = "" + Math.floor(Math.random() * 9999) + 9999;
        a.download = fileName;
        a.click();
       
      },err =>{
        console.log(err)
      });
  }

  PdfExport() {
    this.httpClientService.httpClientMainRouter("WRMAL_328",this.headerParam(),"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res);
        var blob = new Blob([this.s2ab(atob(response.body))], {
          type: "application/pdf;base64,",
        });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        let fileName = "" + Math.floor(Math.random() * 9999) + 9999;
        a.download = fileName;
        a.click();
       
      },err =>{
        console.log(err)
      });
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  async getTransactionTypes() {
    this.httpClientService.httpClientMainRouter("WRMAL_125",`null`,"GET")
      .subscribe( res => {
        this.transactionTypes = this._sharedService.decrypt(res).body;
      },err =>{
        console.log(err)
      });
  }
}
