import { WrapperURLs } from "./../../../environments/WrapperURLs";
/** @format */

import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
// import { ToasterService } from "app/_services/toaster.service";
import { environment } from "environments/environment";
import { AuthServiceService } from "app/_services/authentication-service";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
// import { HttpService } from "app/_services/http.service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
// import { OnAppRefreshService } from "app/_services/on-app-refresh.service";
import { SweetAlertToastService } from "../../_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";

@Component({
  selector: "app-link-t24-account",
  templateUrl: "./link-t24-account.html",
  styleUrls: ["./link-t24-account.scss"],
})
export class LinkT24AccountComponent implements OnInit {
  layoutDir = "ltr";
  T24Account: any;
  showConfirm: boolean = false;
  isLinked: boolean = false;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  linkAccount: FormGroup;
  pageTitle: string = "link_t24_account";
  showErrorMsg: boolean;
  errorMsg: any;
  walletId: any;
  phoneNo: any;
  showOtp: boolean = false;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    public authService: AuthServiceService,
    private toaster: SweetAlertToastService,
    private router: Router,
    private fb: FormBuilder,
    private httpService: HttpService,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.ngProgress.start();
    this.linkAccount = this.fb.group({
      accountNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      otpCode: [""],
    });
    this.ngProgress.done();
    this.getWalletId();
  }
  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bank.link_t24_account.getWalletId
    );
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
    this.T24Account = agentBalance[0].t24AccountNum;
    this.phoneNo = agentBalance[0].mobileNumber;
    // this.T24Account = 123456789;
  }

  async showConfirmDiv() {
    this.showConfirm = true;
  }
  cancelAccountLink() {
    this.showConfirm = false;
  }
  async getOtp() {
    this.linkAccount.controls.accountNumber.markAsTouched();
    this.ngProgress.start();
    if (this.linkAccount.valid) {
      this.request_options.method = "POST";
      this.httpService.setHeader(
        "SERVICE_WRAPPER",
        WrapperURLs.bank.link_t24_account.getOtp
      );

      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      this.httpService.setHeader("x-auth-token", token);
      this.request_options.body = {
        t24AccountNum: this.linkAccount.value.accountNumber,
      };

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        // this.linkAccount.get("otpCode").setValue(response.body.code);
        this.linkAccount
          .get("otpCode")
          .setValidators([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern("^[0-9]*$"),
          ]);
        this.linkAccount.get("otpCode").updateValueAndValidity();

        this.showConfirm = false;
        this.showOtp = true;
        this.ngProgress.done();
      } else {
        this.ngProgress.done();
        let errorMsg = response.msgWithLanguage;
        this.toaster.showError(errorMsg);
      }
    }
  }
  async confirm() {
    this.linkAccount.controls.accountNumber.markAsTouched();
    this.ngProgress.start();
    if (this.linkAccount.valid) {
      this.request_options.method = "POST";
      this.httpService.setHeader(
        "SERVICE_WRAPPER",
        WrapperURLs.bank.link_t24_account.confirm
      );

      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      this.httpService.setHeader("x-auth-token", token);
      this.request_options.body = {
        t24AccountNum: this.linkAccount.value.accountNumber,
        otpCode: this.linkAccount.value.otpCode,
      };

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        this.toaster.showSuccess(
          await this.findAllLanguagesService.getTranslate("operation_done")
        );
        this.linkAccount.reset();
        this.ngProgress.done();
      } else {
        this.ngProgress.done();
        let errorMsg = response.msgWithLanguage;
        this.toaster.showError(errorMsg);
      }
    }
  }
}
