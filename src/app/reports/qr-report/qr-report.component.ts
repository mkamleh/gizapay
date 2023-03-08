/** @format */

import { Component, OnInit } from "@angular/core";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-qr-report",
  templateUrl: "./qr-report.component.html",
  styleUrls: ["./qr-report.component.scss"],
})
export class QrReportComponent implements OnInit {
  count = 50;
  offset = 0;
  rows: any;
  temp: any = [];
  error: any;
  elementType: "url" | "canvas" | "img" = "url";
  value: string;
  pageTitle: string = "QR_report";
  showErrorMsg: boolean;
  errorMsg: any;
  constructor(
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private httpService: HttpService,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.getQRs(0);
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
  getQRs(page) {
    this.httpClientService.httpClientMainRouter("WRMAL_044",`page=${page}&size=10`,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res)
        let detailedRrows = response.body.pageList;
        this.count = response.body.count;  
        this.rows = detailedRrows.map((item) => {
          return {
            accountId: item.accountId,
            code: item.code,
            amount: item.amount + " " + item.curruncyCaption,
            statusCaption: item.statusCaption,
            creationDate: this.parseDate(item.creationDate),
            expDate: this.parseDate(item.expDate),
            type: item.type,
            // brandName: item.brandName
            brandName: item.profileCaption.brandName,
          };
        });
        // cache our list
        this.temp = [...this.rows];        
      },err =>{
        console.log(err)
      });
  }

  onPage(event) {
    console.log("Page Event", event);
    this.getQRs(event.offset);
    // this.page(event.offset, event.limit);
  }
  updateFilter(event) {
    const val = event.target.value;
    console.log("searche Value", val);

    // filter our data
    const temp = this.temp.filter((d) => {
      return (
        d.amount.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.statusCaption.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.type.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.brandName.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.creationDate.toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.expDate.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
  }
}
