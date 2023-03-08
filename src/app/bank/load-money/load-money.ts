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
    private httpService: HttpService,
    public adminLayout: AdminLayoutComponent,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.ngProgress.start();
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
    this.ngProgress.done();
  }
  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bank.load_money.getWalletId
    );
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
    this.T24Account = agentBalance[0].t24AccountNum;
    // this.T24Account = 123456789;
  }

  async getTransactionTypes() {
    this.ngProgress.start();
    let token = this.cookieService.get("agt_token");
    this.request_options.method = "GET";
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bank.load_money.getTransactionTypes
    );
    this.httpService.setHeader("x-auth-token", token);

    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      let transactionTypes = response.body;
      this.transactionType = transactionTypes.find(
        (e) => e.transactionTypeId == 14
      );
      this.ngProgress.done();
    } else {
      this.ngProgress.done();
    }
  }
  async getTransactionSources() {
    this.ngProgress.start();
    let token = this.cookieService.get("agt_token");
    this.request_options.method = "GET";
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bank.load_money.getTransactionSources
    );
    this.httpService.setHeader("x-auth-token", token);

    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      let transactionSources = response.body;
      this.transactionSource = transactionSources.find(
        (e) => e.transactionSourceId == 2
      );
      console.log("transactionSources", transactionSources);
      this.ngProgress.done();
    } else if (response.status == 401) {
      this.authService.logoutUser();
      this.ngProgress.done();
    } else if (response.status == 500) {
      this.showErrorMsg = true;
      let tecErr = await this.findAllLanguagesService.getTranslate(
        "tech_issue"
      );
      this.toaster.showError(tecErr);
      this.ngProgress.done();
      this.errorMsg = tecErr;
    } else {
      this.ngProgress.done();
    }
  }

  async getTransactionOtp() {
    this.disableLoadMoney = true;
    this.stopTimer();
    this.ngProgress.start();
    let token = this.cookieService.get("agt_token");
    this.request_options.method = "POST";
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bank.load_money.getTransactionOtp
    );
    this.httpService.setHeader("x-auth-token", token);

    this.request_options.body = {
      walletId: this.walletId,
      transactionTypeCode: "LOAD_MONEY_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.loadMoneyForm.value.amount,
    };

    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 201) {
      if (response.body.transactionOTPFlag == "true") {
        let otpObj = response.body;
        this.generatedOtp = otpObj.code;
        this.loadMoneyForm.get("otp").setValue(this.generatedOtp);
        this.showOtp = true;
        console.log("this.generatedOtp", this.generatedOtp);
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
        // otp.updateValueAndValidity();

        this.ngProgress.done();
      } else {
        this.loadMoney();
      }
    } else {
      this.ngProgress.done();
      this.toaster.showError(response.msgWithLanguage);
      this.loadMoneyForm.get("otpCode").setValue(null);
      this.loadMoneyForm.get("otpCode").clearValidators();
      this.loadMoneyForm.get("otpCode").updateValueAndValidity();
      this.loadMoneyForm.reset();
    }
    const otp = this.loadMoneyForm.get("otp");
    this.loadMoneyForm.get("amount").valueChanges.subscribe((amount) => {
      console.log("amount00", amount);
      if (amount <= 0) {
        this.loadMoneyForm.get("otp").setValidators(null);
        this.loadMoneyForm.get("otp").clearValidators();
        this.loadMoneyForm.get("otp").updateValueAndValidity();
      }
      //  else if (amount >= 0) {
      //   this.loadMoneyForm
      //     .get("otp")
      //     .setValidators([
      //       Validators.required,
      //       Validators.minLength(6),
      //       Validators.maxLength(6),
      //       Validators.pattern("^[0-9]*$"),
      //     ]);

      //   otp.updateValueAndValidity();

      //   console.log("checking form value", this.loadMoneyForm.value);
      // }
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
    this.ngProgress.start();
    if (this.loadMoneyForm.valid) {
      let token = this.cookieService.get("agt_token");
      this.request_options.method = "POST";

      this.httpService.setHeader(
        "SERVICE_WRAPPER",
        WrapperURLs.bank.load_money.loadMoney
      );
      this.httpService.setHeader("x-auth-token", token);

      this.request_options.body = {
        destinationAmount: this.loadMoneyForm.value.amount,
        otpCode: this.loadMoneyForm.value.otp,
        sourceCode: "WEB",
      };

      console.log("this.request_options.body", this.request_options.body);

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        this.toaster.showSuccess(
          await this.findAllLanguagesService.getTranslate("operation_done")
        );
        this.stopTimer();
        this.loadMoneyForm.reset();
        this.showOtp = false;
        this.showConfirm = false;
        this.ngProgress.done();
        this.loadMoneyForm.get("otp").setValidators(null);
        this.loadMoneyForm.get("otp").clearValidators();
        this.loadMoneyForm.get("otp").updateValueAndValidity();
      } else if (response.status == 401) {
        this.authService.logoutUser();
        this.ngProgress.done();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);
        this.ngProgress.done();

        this.errorMsg = tecErr;
      } else {
        this.ngProgress.done();
        this.toaster.showError(response.msgWithLanguage);
        this.showOtp = false;
        this.showConfirm = false;
        this.loadMoneyForm.get("otp").clearValidators();
        this.loadMoneyForm.get("otp").updateValueAndValidity();
        this.loadMoneyForm.reset();
      }
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
