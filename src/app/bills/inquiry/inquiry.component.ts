import { WrapperURLs } from "./../../../environments/WrapperURLs";
/** @format */

import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { environment } from "environments/environment";
import * as $ from "jquery";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { HttpService } from "app/_services/HttpService";
import { Encryption } from "app/_services/Encryption";

@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.scss"],
})
export class InquiryComponent implements OnInit {
  pageTitle: any = "inquiry";
  layoutDir: any;
  payBillForm: FormGroup;
  token: string;
  lng: any;
  categories: any = [];
  error: string;
  billers: any = [];
  showBillInfo: boolean = false;
  billInfo: any;
  showErrorMsg: boolean;
  errorMsg: any;
  showConfirm: boolean;
  disabled: boolean;
  timeLeft: number = 60;
  interval;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  showOtp: boolean;
  walletId: any;
  generatedOtp: any;

  constructor(
    public fb: FormBuilder,
    private http: HttpClient,
    public ngProgress: NgProgress,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private cookieService: CookieService,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService,
    private authService: AuthServiceService,
    private httpService: HttpService,
    private encryption: Encryption
  ) {
    this.token = this.cookieService.get("agt_token");
    this.lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", this.lng);
    this.layoutDir = this.lng.direction;

    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.payBillForm = this.fb.group({
      category: [""],
      biller: ["", Validators.compose([Validators.required])],
      billNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      otp: [null],
    });
    // this.getCategories();
    this.getBillers(1);
  }
  getCategories() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: this.lng.code,
      "x-auth-token": this.token,
      SERVICE_WRAPPER: WrapperURLs.bills.inquiry.getCategories,
    });

    this.ngProgress.start();
    return this.http
      .get<string>(`${environment.secureUrl}`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        async (response) => {
          let categoriesObj: any = this.encryption.decrypt(response);
          this.categories = categoriesObj.body;
          console.log("getCategories", categoriesObj);
          this.ngProgress.done();
          this.error = "";
        },
        async (error) => {
          try {
            let response: any = this.encryption.decrypt(error.error)!;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          } catch {
            let response2: any = error;

            this.error = response2.msgWithLanguage;
            if (response2.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );

              this.toaster.showError(this.error);
            }
            if (response2.status === 401) {
              this.toaster.showError("Session Time out");
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        }
      );
  }

  getBillers(categoryId) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: this.lng.code,
      "x-auth-token": this.token,
      SERVICE_WRAPPER: WrapperURLs.bills.inquiry.getBillers,
      SERVICE_PARAM: `categoryId=${categoryId}`,
    });

    this.ngProgress.start();
    return this.http
      .get<string>(`${environment.secureUrl}`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        async (response) => {
          let billers: any = this.encryption.decrypt(response);
          this.billers = billers.body;
          console.log(" this.billers from getBillers", this.billers);
          if (this.billers && this.billInfo) {
            let selectedBiller = this.billers.find(
              (e) => e.billerCode == this.billInfo.billerCode
            );
            this.payBillForm.get("biller").setValue(selectedBiller);
            console.log("bbbb", selectedBiller);
          }

          this.ngProgress.done();
          this.error = "";
        },
        async (error) => {
          try {
            let response: any = this.encryption.decrypt(error.error)!;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          } catch {
            let response2: any = error;

            this.error = response2.msgWithLanguage;
            if (response2.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response2.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        }
      );
  }

  getBillInfo() {
    let billerNo = this.payBillForm.controls["biller"].value
      ? this.payBillForm.controls["biller"].value.billerCode
      : "";
    let billNo = this.payBillForm.controls["billNo"].value;
    console.log("billerNo", billerNo);
    console.log("billNo", billNo);

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: this.lng.code,
      "x-auth-token": this.token,
      SERVICE_WRAPPER: WrapperURLs.bills.inquiry.getBillInfo,
      SERVICE_PARAM: `billerNo=${billerNo}&billNo=${billNo}`,
    });

    this.ngProgress.start();
    return this.http
      .get<string>(`${environment.secureUrl}`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        async (response) => {
          let billInfoObj: any = this.encryption.decrypt(response);
          this.billInfo = billInfoObj.body;

          if (this.billInfo) {
            this.showBillInfo = true;
            this.scrollItem();
            this.showConfirm = false;
            if (this.billInfo.statusId != "7") {
              this.disabled = false;
            } else {
              this.disabled = true;
            }
          }
          let selectedCat = this.categories.find(
            (e) => e.caption == billInfoObj.body.billerCategoryCaption
          );
          if (selectedCat) {
            this.billInfo.category = selectedCat;
            this.payBillForm.get("category").setValue(selectedCat);
            // this.getBillers(selectedCat.billerCategoryId);
            if (this.billers) {
              let selectedBiller = this.billers.find(
                (e) => e.billerCode == billInfoObj.body.billerCode
              );
              console.log("selected biller", selectedBiller);

              this.payBillForm.get("biller").setValue(selectedBiller);
              this.billInfo.biller = selectedBiller;
            }
          }

          this.billInfo.billNo = this.payBillForm.controls["billNo"].value;
          console.log("billInfoObj", billInfoObj);
          this.ngProgress.done();
          this.error = "";
        },
        async (error) => {
          try {
            let response: any = this.encryption.decrypt(error.error)!;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          } catch {
            let response2: any = error;

            this.error = response2.msgWithLanguage;
            if (response2.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response2.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        }
      );
  }
  categoryChanged() {
    console.log("this.payBillForm.controls", this.payBillForm.controls);
    if (this.payBillForm.controls["category"].value != null) {
      this.getBillers(
        this.payBillForm.controls["category"].value.billerCategoryId
      );
    }
  }

  scrollTop() {
    $(document).ready(function () {
      let el = document.getElementById("modal");
      el.scrollIntoView(true);
    });
  }

  // to scroll down to bill info
  scrollItem() {
    if (this.showBillInfo) {
      $(document).ready(function () {
        let el = document.getElementById("modal1");
        el.scrollIntoView(true);
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
        this.payBillForm.get("otp").setValue(null);
        this.showOtp = false;
        this.showConfirm = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
    this.timeLeft = 60;
  }

  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bills.inquiry.getWalletId
    );
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
  }
  async getTransactionOtp() {
    this.stopTimer();
    this.ngProgress.start();
    let token = this.cookieService.get("agt_token");
    this.request_options.method = "POST";
    this.httpService.setHeader(
      "SERVICE_WRAPPER",
      WrapperURLs.bills.inquiry.getTransactionOtp
    );
    this.httpService.setHeader("x-auth-token", token);

    this.request_options.body = {
      walletId: this.walletId,
      transactionTypeCode: "PAY_BILL_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.billInfo.amountDue,
    };

    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 201) {
      let otpObj = response.body;
      this.generatedOtp = otpObj.code;
      this.payBillForm.get("otp").setValue(this.generatedOtp);
      this.showOtp = true;
      console.log("this.generatedOtp", this.generatedOtp);
      this.timeLeft = 60;
      this.startTimer();
      const otp = this.payBillForm.get("otp");

      this.payBillForm
        .get("otp")
        .setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern("^[0-9]*$"),
        ]);

      otp.updateValueAndValidity();
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
      console.log("response: ", response);
      this.toaster.showError(response.msgWithLanguage);
      this.ngProgress.done();
      this.payBillForm.reset();
    }
  }
  payBill() {
    if (this.billInfo) {
      let destinationReference = this.billInfo.sadadNo;
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      let data: any = {
        destinationReference: destinationReference,
        otpCode: this.payBillForm.value.otp,
      };

      console.log("DATA", data);
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: WrapperURLs.bills.inquiry.payBill,
      });
      let requestBody = this.encryption.encrypt(data);

      this.ngProgress.start();
      return this.http
        .post<string>(`${environment.secureUrl}`, requestBody, {
          headers,
          responseType: "text" as "json",
        })
        .subscribe(
          async (response) => {
            let payBillObj: any = this.encryption.decrypt(response);
            console.log("payBillObj", payBillObj);

            let doneMessage = await this.findAllLanguagesService.getTranslate(
              "operation_done"
            );
            this.toaster.showSuccess(doneMessage);
            this.ngProgress.done();
            this.error = "";
            this.payBillForm.reset();
            // this.payBillForm.get("category").setValue("");
            // this.payBillForm.get("billNo").setValue("");
            // this.payBillForm.get("biller").setValue("");
            this.billInfo = {};
            this.showBillInfo = false;
            this.showConfirm = false;
          },
          async (error) => {
            if (error.status === 401) {
              this.authService.logoutUser();
              this.ngProgress.done();
            } else if (error.status == 500) {
              let tecErr = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
              this.toaster.showError(tecErr);
              this.ngProgress.done();

              this.showErrorMsg = true;
              this.errorMsg = tecErr;
            } else {
              let response: any = this.encryption.decrypt(error.error);
              this.error = response.msgWithLanguage;
              if (response.status === 500) {
                this.error = await this.findAllLanguagesService.getTranslate(
                  "tech_issue"
                );
              }
              this.toaster.showError(this.error);
              if (response.status === 401) {
                this.authService.logoutUser();
              }
              this.ngProgress.done();
            }
          }
        );
    }
  }
  showConfirmDiv() {
    this.showConfirm = true;
    // this.showBillInfo = false;
  }
  cancelPayMoney() {
    this.showConfirm = false;
    this.showOtp = false;
    // this.showBillInfo = true;
  }
}
