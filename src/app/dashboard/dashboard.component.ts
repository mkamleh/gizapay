/** @format */

import { Component, OnInit } from "@angular/core";
import { single, multi } from "./charts.data";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import Swal from "sweetalert2";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  count = 10;
  offset = 0;
  rows: any;
  temp: any = [];
  error: any;
  wallets: any;

  wallet: any = {};
  commissionWallet: any = {};

  public single: any[];
  public multi: any[];

  ETB: any;

  // Shared chart options
  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
      position: "bottom",
    },
  };

  // Bar

  barChartData: any[] = [
    {
      data: [6, 5, 8, 8, 5, 5, 4],
      label: "Series A",
      borderWidth: 0,
    },
    {
      data: [5, 4, 4, 2, 6, 2, 5],
      label: "Series B",
      borderWidth: 0,
    },
  ];

  // newsfeed

  pageTitle: any = "HOME";
  showErrorMsg: boolean;
  errorMsg: any;
  greeting: any;
  public now: Date = new Date();
  firstName: any;
  lastName: string;
  commissionWalletBalance: any;
  WalletBalance: any;

  constructor(
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private httpService: HttpService,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService,
    private _sharedServices: SharedService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.AgentBalance();
    Object.assign(this, { single, multi });
    this.ETB = "ETB";
  }

  ngOnInit() {
    this.AgentBalance();
    this.refresh();
    this.getTxn();
    console.log("now", this.now);
    //await this.getCurrentTime();
  }
  async getCurrentTime() {
    let currentTime = this.now.getHours();
    if (currentTime >= 5 && currentTime <= 12) {
      console.log("Morning");
      this.greeting = "Good Morning";
    } else if (currentTime >= 13 && currentTime <= 17) {
      console.log("Afternoon");
      this.greeting = "Good Afternoon";
    } else if (currentTime >= 18 && currentTime <= 24) {
      console.log("Evening");
      this.greeting = "Good Evening";
    }
  }

  onSelect(event) {
    console.log(event);
  }

  updateFilter(event) {
    const val = event.target.value;
    // filter our data
    const temp = this.temp.filter((d) => {
      console.log(d, "Rooo");

      return (
        d.destinationWalletCode.toLowerCase().indexOf(val.toLowerCase()) !==
          -1 ||
        !val ||
        String(d.amount).indexOf(val) !== -1 ||
        !val ||
        d.date.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.externalReference.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.internalReferance.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.sourceWalletCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.statusCaption.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        d.transactionTypeCaption.toLowerCase().indexOf(val.toLowerCase()) !==
          -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
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
    this.getTxn();
  }
  AgentBalance() {
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET").subscribe( res=>{
      this.wallets = this._sharedServices.decrypt(res).body;
      for (let i = 0; i < this.wallets.length; i++) {
        if (this.wallets[i].code.endsWith("C")) {
          this.commissionWalletBalance = this.wallets[i].availableBalanceRnd;
        } else {
          this.WalletBalance = this.wallets[i].availableBalanceRnd;
        }
      }
    },err =>{
    });
  }

  getTxn() {
    this.httpClientService.httpClientMainRouter("WRMAL_472",`page=0&size=10`,"GET").subscribe( res=>{
      let detailedRrows = this._sharedServices.decrypt(res).body.pageList;
      this.rows = detailedRrows.map((item) => {
        return {
          amount: item.amount,
          date: this.parseDate(item.date),
          destinationWalletCode: item.destinationWalletCode,
          externalReference: item.externalReference
            ? item.externalReference
            : "___",
          internalReferance: item.internalReferance,
          sourceWalletCode: item.sourceWalletCode,
          statusCaption: item.statusCaption,
          transactionTypeCaption: item.transactionTypeCaption,
          flow: item.moneyFlow,
        };
      });
      this.temp = [...this.rows];
    },err =>{
    });
  }

  refresh() {
    this.httpClientService.httpClientMainRouter("WRMAL_007",`null`,"GET").subscribe( res=>{
      this.firstName = this._sharedServices.decrypt(res).body.agentProfileResource.agentName;
    },err =>{
    });
  }

  async walletToCBS() {
    if (this.WalletBalance <= 0) {
      Swal(
        await this.findAllLanguagesService.getTranslate("operation failed"),
        await this.findAllLanguagesService.getTranslate(
          "there is no balance in your wallet!"
        ),
        "error"
      );
    } else {
      Swal({
        title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
        text: await this.findAllLanguagesService.getTranslate(
          "wallet-to-cbs-confirmation-msg"
        ),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: await this.findAllLanguagesService.getTranslate(
          "Yes, I'm Sure!"
        ),
        cancelButtonText: await this.findAllLanguagesService.getTranslate(
          "cancel"
        ),
      }).then(async (result) => {
        if (result.value) {
          this.httpClientService.httpClientMainRouter("WRMAL_343",`null`,"POST")
          .subscribe( async res=>{
            let response = this._sharedServices.decrypt(res).body.agentProfileResource.agentName;
            this.toaster.showSuccess(response.text);
            await this.AgentBalance();
          },err =>{
          });    
        }
      });
    }
  }
  async commission_walletToCBS() {
    if (this.commissionWalletBalance <= 0) {
      Swal(
        await this.findAllLanguagesService.getTranslate("operation failed"),
        await this.findAllLanguagesService.getTranslate(
          "there is no balance in your commission wallet!"
        ),
        "error"
      );
    } else {
      Swal({
        title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
        text: await this.findAllLanguagesService.getTranslate(
          "commission-to-agent-wallet-confirmation-msg"
        ),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: await this.findAllLanguagesService.getTranslate(
          "Yes, I'm Sure!"
        ),
        cancelButtonText: await this.findAllLanguagesService.getTranslate(
          "cancel"
        ),
      }).then(async (result) => {
        if (result.value) {
          this.httpClientService.httpClientMainRouter("WRMAL_470",`null`,"POST",{
            sourceCode: "WEB",
          }).subscribe( async res=>{
            let response = this._sharedServices.decrypt(res).body.agentProfileResource.agentName;
            this.toaster.showSuccess(response.text);
            await this.AgentBalance();
          },err =>{
          });          
        }
      });
    }
  }
}
