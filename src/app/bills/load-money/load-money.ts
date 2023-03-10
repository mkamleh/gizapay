import { WrapperURLs } from "./../../../environments/WrapperURLs";
/** @format */

import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { environment } from "environments/environment";
import { AuthServiceService } from "app/_services/authentication-service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SweetAlertToastService } from "../../_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-load-money",
  templateUrl: "./load-money.html",
  styleUrls: ["./load-money.scss"],
})
export class LoadMoneyComponent implements OnInit {
  layoutDir = "ltr";
  T24Account: any;
  disableLoadMoney: boolean = false;
  timeLeft: number = 60;
  interval;
  loadMoneyForm: FormGroup;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  showFees: boolean = false;
  modal: boolean = false;
  walletId: any;
  transferFees: any;
  selectedTransferedValue: any;
  transactionType: any;
  transactionSource: any;
  showOtp: boolean;
  generatedOtp: boolean;
  pageTitle: string = "load_money";
  showErrorMsg: boolean;
  errorMsg: any;
  showConfirm = false;
  disable: boolean = true;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    public authService: AuthServiceService,
    private toaster: SweetAlertToastService,
    private router: Router,
    private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private httpService: HttpService,
    public adminLayout: AdminLayoutComponent,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    // this.ngProgress.start();
    this.loadMoneyForm = this.fb.group({
      amount: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      otp: [null],
    });

    this.getWalletId();

    this.getTransactionTypes();
    this.getTransactionSources();
   // this.ngProgress.done();;
  }
  getWalletId() {
    this.httpClientService.httpClientMainRouter(
      WrapperURLs.bank.load_money.getWalletId,
      `null`,"GET")
      .subscribe( res=>{
        let agentBalance = this._sharedService.decrypt(res).body;
        this.walletId = agentBalance[0].id;
        this.T24Account = agentBalance[0].t24AccountNum;
      },err =>{
      });    
  }

  getTransactionTypes() {
    // this.ngProgress.start();
    this.httpClientService.httpClientMainRouter(
      WrapperURLs.bank.load_money.getTransactionTypes,
      `null`,"GET")
      .subscribe( res=> {
        let transactionTypes = this._sharedService.decrypt(res).body;
        this.transactionType = transactionTypes.find(
          (e) => e.transactionTypeId == 14
        );
      },err =>{
      });    
  }

  async getTransactionSources() {
    // this.ngProgress.start();
    let response = await this.httpService.http_request(this.request_options);
    this.httpClientService.httpClientMainRouter(
      WrapperURLs.bank.load_money.getTransactionSources,
      `null`,"GET")
      .subscribe( res=> {
        let transactionSources = this._sharedService.decrypt(res).body;
        this.transactionSource = transactionSources.find(
          (e) => e.transactionSourceId == 2
        );
      },err =>{
      });    
  }

  getTransactionOtp() {
    this.disableLoadMoney = true;
    this.stopTimer();
    // this.ngProgress.start();
    let body = {
      walletId: this.walletId,
      transactionTypeCode: "LOAD_MONEY_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.loadMoneyForm.value.amount,
    };

    this.httpClientService.httpClientMainRouter(
      WrapperURLs.bank.load_money.getTransactionOtp,
      `null`,"POST",body)
      .subscribe( res=> {
        let response = this._sharedService.decrypt(res)
        if (response.body.transactionOTPFlag == "true") {
          let otpObj = response.body;
          this.generatedOtp = otpObj.code;
          this.loadMoneyForm.get("otp").setValue(this.generatedOtp);
          this.showOtp = true;
          this.timeLeft = 60;
          this.startTimer();
          this.loadMoneyForm
            .get("otp")
            .setValidators([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern("^[0-9]*$"),
            ]);
          this.loadMoneyForm.get("otp").updateValueAndValidity();
         // this.ngProgress.done();;
        } else {
          this.loadMoney();
        }
      },err => {
        this.loadMoneyForm.get("otpCode").setValue(null);
        this.loadMoneyForm.get("otpCode").clearValidators();
        this.loadMoneyForm.get("otpCode").updateValueAndValidity();
        this.loadMoneyForm.reset();
      });
      
      this.loadMoneyForm.get("amount").valueChanges.subscribe((amount) => {
        console.log("amount00", amount);
        if (amount <= 0) {
          this.loadMoneyForm.get("otp").setValidators(null);
          this.loadMoneyForm.get("otp").clearValidators();
          this.loadMoneyForm.get("otp").updateValueAndValidity();
        }
      });
  }
  async load() {
    if (this.loadMoneyForm.value.amount >= 0) {
      this.getTransactionOtp();
    } else {
      this.showOtp = false;
      this.loadMoney();
    }
  }
  async loadMoney() {
    // this.ngProgress.start();
    if (this.loadMoneyForm.valid) {

      let body = {
        destinationAmount: this.loadMoneyForm.value.amount,
        otpCode: this.loadMoneyForm.value.otp,
        sourceCode: "WEB",
      };

      this.httpClientService.httpClientMainRouter(
        WrapperURLs.bank.load_money.loadMoney,
        `null`,"POST",body).subscribe( async res=> {
          this.toaster.showSuccess(
            await this.findAllLanguagesService.getTranslate("operation_done")
          );
          this.stopTimer();
          this.loadMoneyForm.reset();
          this.showOtp = false;
          this.showConfirm = false;
         // this.ngProgress.done();;
          this.loadMoneyForm.get("otp").setValidators(null);
          this.loadMoneyForm.get("otp").clearValidators();
          this.loadMoneyForm.get("otp").updateValueAndValidity();
        },err =>{
        });
    }
  }

  //OTP timer
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.loadMoneyForm.get("otp").setValue(null);
        this.showOtp = false;
        this.showConfirm = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }
  showConfirmDiv() {
    this.showConfirm = true;
  }
  cancelLoadMoney() {
    this.showConfirm = false;
  }
}
