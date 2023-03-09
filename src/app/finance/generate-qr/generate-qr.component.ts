/** @format */

import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { Encryption } from "app/_services/Encryption";
import html2canvas from "html2canvas";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-generate-qr",
  templateUrl: "./generate-qr.component.html",
  styleUrls: ["./generate-qr.component.scss"],
})
export class GenerateQrComponent implements OnInit {
  qrcodename: string;
  title = "generate-qrcode";
  elementType: "url" | "canvas" | "img" = "url";
  value: string;
  display = false;
  href: string;
  href1: string;
  error: string;
  qrStr: any;
  showError: boolean;
  pageTitle: string = "QR_voucher";
  showErrorMsg: boolean;
  errorMsg: any;
  showError1: boolean;
  feesObject: any;

  otpValue: number;

  showTxnSection: boolean = true;
  showFeesSection: boolean = false;
  showOtpSection: boolean = false;

  showErrorOtp: boolean;
  showError1Otp: boolean;

  interval;
  timeLeft: number = 60;
  @ViewChild('screen', {static: false}) screen : ElementRef;
  @ViewChild('canvas', {static: false}) canvas : ElementRef;
  @ViewChild('downloadLink', {static: false}) downloadLink : ElementRef;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,

  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {}
  generateQRCode() {
    // this.ngProgress.start();
    console.log("this.qrcodename", this.qrcodename);
    var amoutValidation = new RegExp(/^\d*(?:[.,]\d{1,2})?$/);

    if (this.qrcodename === undefined || this.qrcodename === "") {
      this.showError = true;
      this.showError1 = false;
    } else if (this.qrcodename === null) {
      // } else if (this.qrcodename == null || this.qrcodename == undefined) {
      this.showError = false;
      this.showError1 = true;
    } else if (
      !amoutValidation.test(this.qrcodename) ||
      Number(this.qrcodename) > 9999.99 ||
      Number(this.qrcodename) < 1
    ) {
      this.showError = false;
      this.showError1 = true;
    } else {
      let data: any = {
        amount: this.qrcodename,
        sourceCode: "WEB",
        otpCode: this.otpValue,
      };     
      this.httpClientService.httpClientMainRouter("WRMAL_043",`null`,"POST",data)
      .subscribe( res =>{
        let qrObj: any = this.encryption.decrypt(res);
        this.qrStr = qrObj.body;
        this.toaster.showSuccess(qrObj.text);
        this.value = this.qrStr.code;
        this.display = true;
        this.showOtpSection = false;
        this.showError = false;
        this.showError1 = false;
        this.showTxnSection = true;
        this.showFeesSection = false;
        this.showOtpSection = false;
      },err =>{
      });
    }
  }
  downloadImage() {
    this.href = (<HTMLImageElement>document.querySelector(".qrcode > img")).src;
    // this.href = document.getElementById("table")[1].src;
  }
  downloadImage2() {
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download = "qrcode.png";
      this.downloadLink.nativeElement.click();
    });
  }
  printImage() {
    this.href = (<HTMLImageElement>document.querySelector(".qrcode > img")).src;
    // this.href = document.getElementById("table")[1].src;
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

  getFees() {
    // Getting fees
    console.log("this.qrcodename", this.qrcodename);
    var amoutValidation = new RegExp(/^\d*(?:[.,]\d{1,2})?$/);

    if (this.qrcodename === undefined || this.qrcodename === "") {
      this.showError = true;
      this.showError1 = false;
    } else if (this.qrcodename === null) {
      // } else if (this.qrcodename == null || this.qrcodename == undefined) {
      this.showError = false;
      this.showError1 = true;
    } else if (
      !amoutValidation.test(this.qrcodename) ||
      Number(this.qrcodename) > 9999.99 ||
      Number(this.qrcodename) < 1
    ) {
      this.showError = false;
      this.showError1 = true;
    } else {
      this.showError = false;
      this.showError1 = false;
      let SERVICE_PARAM = 
      "amount=" +
      this.qrcodename +
      "&source=WEB&type=GENERATE_CASHIN_QR_AGENT&walletId=0";

      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res => {
        this.feesObject = this.encryption.decrypt(res).body;
        this.showTxnSection = false;
        this.showFeesSection = true;
        this.display = true;
      },err =>{
        console.log(err)
      });
    }
  }

  transactionOtp() {
    // Generate OTP fees
    this.stopTimer();
    let body: any = {
      transactionTypeCode: "GENERATE_CASHIN_QR_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.qrcodename,
    };
   
    // this.ngProgress.start();
    let requestBody = this.encryption.encrypt(body);
    this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
      .subscribe( res => {
        let otpResponse: any = this.encryption.decrypt(res);
        let transactionOTPFlag = otpResponse.body.transactionOTPFlag;
        if (transactionOTPFlag == "true") {
          this.showTxnSection = false;
          this.showFeesSection = false;
          this.showOtpSection = true;
          this.qrStr = true;
          this.display = true;
          this.timeLeft = 60;
          this.startTimer();
        } else {
          this.generateQRCode();
        }
      },err =>{
      });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }
  close() {
    this.display = false;
    this.qrcodename = "";

    this.showTxnSection = true;
    this.showFeesSection = false;
    this.showOtpSection = false;
    this.qrStr = false;
  }
}
