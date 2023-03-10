/** @format */

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";

import { Encryption } from "app/_services/Encryption";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { toasterService } from "app/_services/toaster-service";
import { CustomValidators } from "ng2-validation";

@Component({
  selector: "app-school-pay-bill",
  templateUrl: "./pay-school-bill.component.html",
  styleUrls: ["./pay-school-bill.component.scss"],
})
export class PaySchoolBillComponent implements OnInit {
  pageTitle: string = "Pay School bill";
  payBillForm: FormGroup;
  form: FormGroup;
  Categories: any;
  billers: any[] = [];
  services: any;
  error: string;
  showBillInfo: boolean = false;
  billInfo: any;
  paymentFees: any;
  walletId: any;
  payedBill: any;
  showFees: boolean = false;
  // paymentFees.destinationAmountWOfees: any;
  layoutDir = "ltr";
  feesObj: any;
  showOTPForm: boolean = false;

  timeLeft: number = 60;
  interval: any;
  schoolAmount: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  orginalBillers: any[] = [];

  isOnline: boolean = false;
  isOffline: boolean = false;
  isSchool: boolean = true;
  isDSTV: boolean = false;
  isTelecom: boolean = false;
  isDerach: boolean = false;

  packages: any[] = [];
  schoolBills: any[] = [];
  onlineBillerName: void;

  isDSTVNewPackage: boolean = false;

  paymentTypeList = [
    {
      code: "accountCode",
      name: "Account Number",
    },
    {
      code: "primaryIdentity",
      name: "Service Number",
    },
  ];

  periodList = [
    {
      code: "1",
      name: "Month",
    },
    {
      code: "12",
      name: "Year",
    },
  ];

  dstvAmount;
  derachAmount;
  schoolBillId: any;

  showSchoolCard1: boolean = false;
  showSingleSchoolBills: boolean = false;
  showFirstCard: boolean = true;
  isBulkSchoolBill: boolean = false;
  showSchoolProducts: boolean = false;
  showBulkSchoolBills: boolean = false;
  showEnterPayerInfo: boolean = false;
  schoolProducts: any[] = [];
  schoolProductsArray: any[] = [];
  bulkSchoolBills: any[] = [];
  selected: any;
  bulkSchoolBillsObj: any;
  derachServiceProviders: any;
  schoolBillerCode: any;

  constructor(
    private httpService: HttpService,
    private _sharedService: SharedService,
    private fb: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    private http: HttpClient,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    public adminLayout: AdminLayoutComponent,
    public findAllLanguagesService: FindAllLanguagesService,
    public findLanguages: FindAllLanguagesService,
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.toaster.showWarning(
      "Bill Payment School feature in maintenance... it will work soon!"
    );
    this.loadForm();
    this.ngProgress.start();
    // this.getCategories();
    this.getBillers("");
    // this.getDerachServiceProviders();
    // this.getPackages();
    this.ngProgress.done();
  }

  loadForm() {
    this.payBillForm = this.fb.group({
      category: [null],
      biller: [null],
      // service: [null, Validators.compose([Validators.required])],
      sadadBillNum: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      otpCode: [
        null,
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]),
      ],
      packageId: [null, Validators.compose([Validators.required])],
      telecomePaymentType: [null, Validators.compose([Validators.required])],
      telecomeSubscriptionNumber: [
        null,
        Validators.compose([Validators.required]),
      ],
      smartCardNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      invoicePeriod: [null, Validators.compose([Validators.required])],
      subscriptionCode: [null, Validators.compose([Validators.required])],
      biller_id: [null, Validators.compose([Validators.required])],
      bill_id: [null, Validators.compose([Validators.required])],
      searchForBiller: [null],
    });
  }

  loadPayerInfoForm() {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(254),
          CustomValidators.email,
        ],
      ],
      mobile: [
        null,
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10),
          Validators.pattern(/^-?(0|[+0-9]\d*)?$/),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
          Validators.pattern(/^[ a-zA-Z\u0600-\u06FF\u1200-\u137F]*$/),
        ],
      ],
    });
  }

  getBillers(code) {
    // Getting the billers
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    let token = this.cookieService.get("agt_token");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: lng.code,
      "x-auth-token": token,
      SERVICE_WRAPPER: "WRMAL_456",
      SERVICE_PARAM: "categoryId=" + code,
    });
    console.log("categoryId=" + code);

    return this.http
      .get<string>(`${environment.secureUrl}/`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        (response) => {
          console.log("biller response=" + response);
          let billersObj: any = this.encryption.decrypt(response);
          this.billers = billersObj.body;
          this.orginalBillers = billersObj.body;
          console.log("getting Billers", this.billers);
          this.error = "";
        },
        async (error) => {
          console.log("error=" + error);
          let response: any = this.encryption.decrypt(error.error);
          let response2: any = error;

          this.error = response.msgWithLanguage;
          if (response.status === 500) {
            this.error = await this.findLanguages.getTranslate("tech_issue");
          }
          this.toaster.showError(this.error);
          if (response2.status === 401) {
            this.authService.logoutUser();
          }
        }
      );
  }

  async getBillInfo() {
    this.payBillForm.get("otpCode").clearValidators();
    this.payBillForm.get("otpCode").updateValueAndValidity();

    this.ngProgress.start();
    this.toaster.showWarning(
      "Bill Payment School feature in maintenance... it will work soon!"
    );
    this.ngProgress.done();

    // Getting the bill info
    console.log("getBillInfo", this.payBillForm.value);

    // if (this.payBillForm.valid) {
    //   console.log("valid");

    //   this.request_options.method = "GET";
    //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_451");
    //   this.httpService.setHeader(
    //     "SERVICE_PARAM",
    //     `subscriptionCode=${this.payBillForm.value.subscriptionCode}`
    //   );
    //   this.request_options.body = {};
    //   console.log("body >>>>>>", this.request_options.body);

    //   let response = await this.httpService.http_request(this.request_options);
    //   if (response.status == 200) {
    //     this.schoolBills = response.body;
    //     console.log("this.schoolBills", this.schoolBills);
    //     this.showBillInfo = true;
    //     this.showSchoolCard1 = true;
    //     this.showSingleSchoolBills = false;
    //     this.showFirstCard = false;
    //   } else {
    //     let error = response.msgWithLanguage;
    //     if (response.status === 500) {
    //       error = await this.findLanguages.getTranslate("tech_issue");
    //     }
    //     this.toaster.showError(error);
    //     if (response.status === 401) {
    //       this.authService.logoutUser();
    //     }
    //   }
    // } else {
    //   console.log("not valid >>>>", this.payBillForm.controls);
    // }
    this.ngProgress.done();
  }
  async payBillFees() {
    this.ngProgress.start();
    if (this.isOffline) {
      // Getting the billers
      let lng = JSON.parse(this.cookieService.get("agtLang"));
      let token = this.cookieService.get("agt_token");
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray[0].id;
      console.log("this.walletId", this.walletId);

      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_130",
        SERVICE_PARAM:
          "amount=" +
          this.billInfo.amountDue +
          "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
          this.walletId,
      });

      return this.http
        .get<string>(`${environment.secureUrl}/`, {
          headers,
          responseType: "text" as "json",
        })
        .subscribe(
          (response) => {
            let paymentFeesObj: any = this.encryption.decrypt(response);
            let feesObj = paymentFeesObj.body;
            this.paymentFees = {
              calcFees: feesObj.calcFeesRnd,
              destinationAmount: feesObj.destinationAmountRnd,
              destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
              sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
              sourceCode: feesObj.sourceCode,
              sourceAmountWfees: feesObj.sourceAmountWfees,
              initiationOperationCurrencyCaption:
                feesObj.initiationOperationCurrencyCaption,
            };
            this.showFees = !this.showFees;
            // this.ngxSmartModalService.getModal("myBootstrapModal").open();

            console.log("payBillConfirmation", this.paymentFees);
            this.error = "";
            this.ngProgress.done();
          },
          async (error) => {
            let response: any = this.encryption.decrypt(error.error);
            let response2: any = error;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findLanguages.getTranslate("tech_issue");
            }
            this.toaster.showError(this.error);
            if (response2.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        );
    } else if (this.isOnline) {
      let amount = this.getAmountFromOnline();

      console.log("online");
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray[0].id;
      console.log("this.walletId", this.walletId);
      this.request_options.method = "GET";
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_130");
      this.httpService.setHeader(
        "SERVICE_PARAM",
        "amount=" +
          amount +
          "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
          this.walletId
      );
      this.request_options.body = {};
      console.log("body >>>>>>", this.request_options.body);

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        let feesObj = response.body;
        console.log("feesObj >>>", feesObj);

        this.paymentFees = {
          calcFees: feesObj.calcFeesRnd,
          destinationAmount: feesObj.destinationAmountRnd,
          destinationAmountWOfees: amount,
          sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
          sourceCode: feesObj.sourceCode,
          sourceAmountWfees: feesObj.sourceAmountWfees,
          initiationOperationCurrencyCaption:
            feesObj.initiationOperationCurrencyCaption,
        };
        this.showFees = !this.showFees;
        this.showBillInfo = !this.showBillInfo;
      } else {
        let error = response.msgWithLanguage;
        if (response.status === 500) {
          error = await this.findLanguages.getTranslate("tech_issue");
        }
        this.toaster.showError(error);
        if (response.status === 401) {
          this.authService.logoutUser();
        }
      }

      this.ngProgress.done();
    }
  }

  async payBillFees_School(amount, id?) {
    let valid = false;
    if (this.isBulkSchoolBill) {
      this.form.controls.email.markAsTouched();
      this.form.controls.mobile.markAsTouched();
      this.form.controls.name.markAsTouched();
      if (this.form.valid) {
        valid = true;
      }
    } else {
      valid = true;
    }
    if (valid) {
      this.ngProgress.start();
      console.log("school");
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray;
      console.log("this.walletIdsss", this.walletId);
      this.request_options.method = "GET";
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_130");
      this.httpService.setHeader(
        "SERVICE_PARAM",
        "amount=" +
          amount +
          "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
          this.walletId
      );
      this.request_options.body = {};
      this.schoolAmount = amount;
      if (id) {
        this.schoolBillId = id;
      }
      console.log("body >>>>>>", this.request_options.body);

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        this.feesObj = response.body;
        console.log("feesObj >>>", this.feesObj);

        this.paymentFees = {
          calcFees: this.feesObj.calcFeesRnd,
          destinationAmount: this.feesObj.destinationAmountRnd,
          destinationAmountWOfees: amount,
          sourceOperationCurrencyCode: this.feesObj.sourceOperationCurrencyCode,
          sourceCode: this.feesObj.sourceCode,
          sourceAmountWfees: this.feesObj.sourceAmountWfees,
          initiationOperationCurrencyCaption:
            this.feesObj.initiationOperationCurrencyCaption,
        };
        this.showFees = !this.showFees;
        this.showBillInfo = !this.showBillInfo;
        this.showEnterPayerInfo = false;
      } else {
        let error = response.msgWithLanguage;
        if (response.status === 500) {
          error = await this.findLanguages.getTranslate("tech_issue");
        }
        this.toaster.showError(error);
        if (response.status === 401) {
          this.authService.logoutUser();
        }
      }
      this.ngProgress.done();
    }
  }

  async createOTP(myForm) {
    this.stopTimer();
    console.log("send otp");
    // console.log("amountDue", this.billInfo.amountDue);
    let amount;
    if (this.isOffline) {
      amount = this.billInfo.amountDue;
    } else if (this.isOnline) {
      amount = this.getAmountFromOnline();
    } else if (this.isSchool) {
      amount = this.schoolAmount;
    }
    console.log("amount: ", amount);
    if (amount >= 0) {
      console.log("otpss", this.request_options.body);
      let token = this.cookieService.get("agt_token");
      this.request_options.method = "POST";
      this.httpService.removeHeader("SERVICE_WRAPPER");
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_183");

      this.request_options.body = {
        walletId: this.walletId,
        transactionTypeCode: "PAY_BILL_AGENT",
        transactionSourceCode: "WEB",
        transactionAmount: amount,
      };

      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 201) {
        if (response.body.transactionOTPFlag == "true") {
          this.payBillForm
            .get("otpCode")
            .setValidators([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern(/^-?(0|[0-9]\d*)?$/),
            ]);
          this.showOTPForm = true;
          this.timeLeft = 60;
          this.startTimer();

          console.log("otp", response.body.code);
        } else {
          this.payBillForm.get("otpCode").setValue(null);
          this.payBillForm.get("otpCode").clearValidators();
          this.payBillForm.get("otpCode").updateValueAndValidity();

          this.payBill(myForm);
        }
      } else {
        this.showOTPForm = false;
        let error = response.msgWithLanguage;
        if (response.status === 500) {
          error = await this.findLanguages.getTranslate("tech_issue");
        }
        this.toaster.showError(error);
        if (response.status === 401) {
          this.authService.logoutUser();
        }
      }
    }
  }

  payBill(myForm) {
    if (this.isBulkSchoolBill) {
      this.payBulkSchoolBills();
    } else {
      this.payBillForm.controls.otpCode.markAsTouched();
      // Getting the billers
      // let lng = JSON.parse(this.cookieService.get("agtLang"));
      let token = this.cookieService.get("agt_token");

      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        lng: this.cookieService.get("agtLang"),
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_461",
      });

      let data = {
        billId: this.schoolBillId,
        // sourceCode: "WEB",
        // otpCode: this.payBillForm.value.otpCode,

        destinationAmount: this.paymentFees.destinationAmount,
        sourceCode: "WEB",
        otpCode: this.payBillForm.value.otpCode,
      };

      console.log("daataa>>>", data);

      if (this.payBillForm.valid) {
        let requestBody = this.encryption.encrypt(data);

        this.ngProgress.start();

        console.log("payBill", data);

        return this.http
          .post<string>(`${environment.secureUrl}/`, requestBody, {
            headers,
            responseType: "text" as "json",
          })
          .subscribe(
            async (response) => {
              this.stopTimer();
              this.showOTPForm = false;
              let payBillObj: any = this.encryption.decrypt(response);
              this.payedBill = payBillObj.body;
              let doneMessage = await this.findAllLanguagesService.getTranslate(
                "operation_done"
              );
              this.toaster.showSuccess(doneMessage); // reset values on success
              this.showBillInfo = false;
              this.showFees = false;

              // reset the form on submitting
              this.payBillForm.reset();
              Object.keys(this.payBillForm.controls).forEach((key) => {
                this.payBillForm.get(key).setErrors(null);
              });
              // myForm.resetForm();

              // this.markFormGroupTouched(this.payBillForm.controls);
              this.error = "";
              console.log("payBill", payBillObj);
              this.error = "";
              this.showFirstCard = true;

              this.ngProgress.done();
            },
            async (error) => {
              let response: any = this.encryption.decrypt(error.error);
              let response2: any = error;

              this.error = response.msgWithLanguage;
              if (response.status === 500) {
                this.error = await this.findLanguages.getTranslate(
                  "tech_issue"
                );
              }
              this.toaster.showError(this.error);
              // reset the form on submitting
              // myForm.resetForm();
              Object.keys(this.payBillForm.controls).forEach((key) => {
                this.payBillForm.get(key).setErrors(null);
              });
              if (response2.status === 401) {
                this.authService.logoutUser();
              }
              this.ngProgress.done();
            }
          );
      }
    }
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.payBillForm.get("otpCode").setValue(null);
        this.showOTPForm = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }

  cancelOTP() {
    this.payBillForm.get("otpCode").setValue(null);
    this.payBillForm.get("otpCode").clearValidators();
    this.payBillForm.get("otpCode").updateValueAndValidity();
    this.payBillForm.reset();
    this.close();
  }

  changeBiller(event) {
    console.log("DDDDDDDDDDDDDDD");
    this.schoolBillerCode = event.value.billerCode;
    console.log(
      "DDDDDDDDDDDDDDD",
      (this.schoolBillerCode = event.value.billerCode)
    );
    console.log("biller >>", event);
    this.isOnline = false;
    this.isOffline = false;
    this.isSchool = true;
    this.disableOffline();
    this.disableDstvForm();
    this.disableTelecom();
    this.enableSchool();
    this.disableDerachForm();
  }

  changePackage(event) {
    console.log("changePackage >>", event);
    if (event.value == "1" || event.value == "13") {
      console.log("<< current package >>");
      this.isDSTVNewPackage = false;
      this.payBillForm.get("invoicePeriod").clearValidators();
      this.payBillForm.get("invoicePeriod").updateValueAndValidity();
    } else {
      console.log("<< new package >>");
      this.isDSTVNewPackage = true;
      this.payBillForm
        .get("invoicePeriod")
        .setValidators([Validators.required]);
      this.payBillForm.get("invoicePeriod").updateValueAndValidity();
    }
  }

  async getPackages() {
    this.request_options.method = "GET";
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_448");
    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      this.packages = response.body;
      console.log(" this.packages ", this.packages);
    }
  }

  disableDstvForm() {
    this.isDSTV = false;
    console.log("this.isDSTV", this.isDSTV);

    this.payBillForm.get("packageId").clearValidators();
    this.payBillForm.get("packageId").updateValueAndValidity();

    this.payBillForm.get("smartCardNumber").clearValidators();
    this.payBillForm.get("smartCardNumber").updateValueAndValidity();

    this.payBillForm.get("invoicePeriod").clearValidators();
    this.payBillForm.get("invoicePeriod").updateValueAndValidity();

    this.payBillForm.get("subscriptionCode").clearValidators();
    this.payBillForm.get("subscriptionCode").updateValueAndValidity();
  }

  enableDstvForm(event) {
    this.isDSTV = true;

    this.onlineBillerName = event.value.brandName;

    this.payBillForm.get("packageId").setValidators([Validators.required]);
    this.payBillForm.get("packageId").updateValueAndValidity();

    this.payBillForm
      .get("smartCardNumber")
      .setValidators([Validators.required]);
    this.payBillForm.get("smartCardNumber").updateValueAndValidity();

    // this.payBillForm.get("dstvPeriodType").setValidators([Validators.required]);
    // this.payBillForm.get("dstvPeriodType").updateValueAndValidity();
  }

  disableTelecom() {
    this.isTelecom = false;
    console.log("this.isTelecom", this.isTelecom);

    this.payBillForm.get("telecomePaymentType").clearValidators();
    this.payBillForm.get("telecomePaymentType").updateValueAndValidity();

    this.payBillForm.get("telecomeSubscriptionNumber").clearValidators();
    this.payBillForm.get("telecomeSubscriptionNumber").updateValueAndValidity();
  }

  enableTelecomForm(event) {
    this.isTelecom = true;

    this.onlineBillerName = event.value.brandName;

    this.payBillForm
      .get("telecomePaymentType")
      .setValidators([Validators.required]);
    this.payBillForm.get("telecomePaymentType").updateValueAndValidity();

    this.payBillForm
      .get("telecomeSubscriptionNumber")
      .setValidators([Validators.required]);
    this.payBillForm.get("telecomeSubscriptionNumber").updateValueAndValidity();
  }
  disableDerachForm() {
    this.isDerach = false;
    console.log("this.isDerach", this.isDerach);

    this.payBillForm.get("biller_id").clearValidators();
    this.payBillForm.get("biller_id").updateValueAndValidity();

    this.payBillForm.get("bill_id").clearValidators();
    this.payBillForm.get("bill_id").updateValueAndValidity();
  }

  enableDerachForm(event) {
    this.isDerach = true;

    this.onlineBillerName = event.value.brandName;

    this.payBillForm.get("biller_id").setValidators([Validators.required]);
    this.payBillForm.get("biller_id").updateValueAndValidity();

    this.payBillForm.get("bill_id").setValidators([Validators.required]);
    this.payBillForm.get("bill_id").updateValueAndValidity();
  }
  disableOffline() {
    this.isOffline = false;
    console.log("this.isOffline", this.isOffline);

    this.payBillForm.get("sadadBillNum").clearValidators();
    this.payBillForm.get("sadadBillNum").updateValueAndValidity();
  }

  enableOffline() {
    this.isOffline = true;
    console.log("this.isOffline", this.isOffline);

    this.payBillForm.get("sadadBillNum").setValidators([Validators.required]);
    this.payBillForm.get("sadadBillNum").updateValueAndValidity();
  }

  enableSchool() {
    this.isSchool = true;
    console.log("this.isSchool", this.isSchool);

    this.payBillForm
      .get("subscriptionCode")
      .setValidators([Validators.required]);
    this.payBillForm.get("subscriptionCode").updateValueAndValidity();
  }

  disableSchool() {
    this.isSchool = false;
    console.log("this.isSchool", this.isSchool);

    this.payBillForm.get("subscriptionCode").clearValidators();
    this.payBillForm.get("subscriptionCode").updateValueAndValidity();
  }

  getAmountFromOnline() {
    let amount;
    if (this.isDSTV) {
      amount = this.dstvAmount;
    }
    if (this.isTelecom) {
      amount = this.billInfo.openAmount;
    }
    if (this.isDerach) {
      amount = this.derachAmount;
    }
    return amount;
  }

  async schoolBillTypeSelection(type) {
    if (type == "single") {
      this.showSchoolCard1 = false;
      this.showSingleSchoolBills = true;
    } else if (type == "bulk") {
      this.isBulkSchoolBill = true;
      this.loadPayerInfoForm();
      /// get products

      let billerId = this.payBillForm.value.biller.id;
      this.request_options.method = "GET";
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_454");
      this.httpService.setHeader("SERVICE_PARAM", `billerId=${billerId}`);
      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        this.schoolProducts = response.body;
        console.log(" this.schoolProducts ", this.schoolProducts);
        this.showSchoolCard1 = false;
        this.showSingleSchoolBills = false;
        this.showSchoolProducts = true;
      } else {
        let error = response.msgWithLanguage;
        if (response.status === 500) {
          error = await this.findLanguages.getTranslate("tech_issue");
        }
        this.toaster.showError(error);
        if (response.status === 401) {
          this.authService.logoutUser();
        }
      }
    }
  }
  rowSelected(product) {
    console.log("product", product);
    let obj = { id: product.id };
    var found = false;

    for (var i = 0; i < this.schoolProductsArray.length; i++) {
      if (this.schoolProductsArray[i].id == product.id) {
        console.log("obj >>", obj);
        console.log("index>>>", i);

        this.schoolProductsArray.splice(i, 1);
        found = true;

        console.log("found>>>", this.schoolProductsArray);
      }
    }
    if (!found) {
      this.schoolProductsArray.push(obj);
      this.selected = product;

      console.log("not found>>>", this.schoolProductsArray);
    }
  }
  isExisted(product) {
    var found = false;
    for (var i = 0; i < this.schoolProductsArray.length; i++) {
      if (this.schoolProductsArray[i].id == product.id) {
        found = true;
        return true;
      }
    }
    if (!found) {
      return false;
    }
  }

  async getBulkSchoolBills() {
    if (this.schoolProductsArray.length == 0) {
      this.toaster.showError(" Please Select Product!");
      return;
    }
    let billerId = this.payBillForm.value.biller.id;
    this.request_options.method = "POST";
    this.request_options.body = {
      subscriptionCode: this.payBillForm.value.subscriptionCode,
      billerId: billerId,
      productList: this.schoolProductsArray,
    };
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_453");
    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      this.bulkSchoolBillsObj = response.body;
      this.bulkSchoolBills = response.body.schoolInvoiceResourceList;
      console.log(" this.bulkSchoolBillsObj ", this.bulkSchoolBillsObj);
      this.showSchoolCard1 = false;
      this.showSingleSchoolBills = false;
      this.showSchoolProducts = false;
      this.showBulkSchoolBills = true;
    } else {
      let error = response.msgWithLanguage;
      if (response.status === 500) {
        error = await this.findLanguages.getTranslate("tech_issue");
      }
      this.toaster.showError(error);
      if (response.status === 401) {
        this.authService.logoutUser();
      }
    }
  }

  async enterPayerInfo() {
    if (this.bulkSchoolBills.length == 0) {
      this.toaster.showError(
        await this.findLanguages.getTranslate("no-bills-err-msg")
      );
    } else {
      this.showSchoolCard1 = false;
      this.showSingleSchoolBills = false;
      this.showSchoolProducts = false;
      this.showBulkSchoolBills = false;
      this.showEnterPayerInfo = true;
    }
  }

  filterBranchOptions(event) {
    this.billers = this.orginalBillers;
    this.billers = this.billers.filter((d) => {
      return d.entityName.toLowerCase().indexOf(event.toLowerCase()) !== -1;
    });
  }

  async payBulkSchoolBills() {
    this.payBillForm.controls.otpCode.markAsTouched();
    let billerId = this.payBillForm.value.biller.id;
    this.request_options.method = "POST";
    this.request_options.body = {
      subscriptionCode: this.payBillForm.value.subscriptionCode,
      billerId: billerId,
      sourceCode: "WEB",
      payerResource: {
        email: this.form.value.email,
        mobile: this.form.value.mobile,
        name: this.form.value.name,
      },
      productList: this.schoolProductsArray,
      otpCode: this.payBillForm.value.otpCode,
      billerCode: this.schoolBillerCode,
      destinationAmount: this.feesObj.destinationAmount,
    };
    console.log(" this.request_options.body ", this.request_options.body);
    if (this.payBillForm.valid) {
      this.ngProgress.start();
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_459");
      let response = await this.httpService.http_request(this.request_options);
      if (response.status == 200) {
        this.stopTimer();

        console.log("response.body ", response.body);
        this.showSchoolCard1 = false;
        this.showSingleSchoolBills = false;
        this.showSchoolProducts = false;
        this.showBulkSchoolBills = false;
        this.showEnterPayerInfo = false;
        this.showFees = false;
        this.showOTPForm = false;
        this.showFirstCard = true;
        this.showBillInfo = false;
        this.showFees = false;

        this.payBillForm.reset();
        this.form.reset();
        this.form.clearValidators();
        this.form.updateValueAndValidity();
        this.schoolProductsArray = [];
        let doneMessage = await this.findAllLanguagesService.getTranslate(
          "operation_done"
        );
        this.toaster.showSuccess(doneMessage); // reset values on success

        // reset the form on submitting
        Object.keys(this.payBillForm.controls).forEach((key) => {
          this.payBillForm.get(key).setErrors(null);
        });
        this.ngProgress.done();
      } else {
        let error = response.msgWithLanguage;
        if (response.status === 500) {
          error = await this.findLanguages.getTranslate("tech_issue");
        }
        this.toaster.showError(error);
        if (response.status === 401) {
          this.authService.logoutUser();
        }
        this.ngProgress.done();
      }
    }
  }
  close() {
    this.stopTimer();
    this.showSchoolCard1 = false;
    this.showSingleSchoolBills = false;
    this.showSchoolProducts = false;
    this.showBulkSchoolBills = false;
    this.showEnterPayerInfo = false;
    this.showFees = false;
    this.showOTPForm = false;
    this.showBillInfo = false;
    this.showFees = false;
    this.showFirstCard = true;

    this.schoolProductsArray = [];

    this.payBillForm.reset();
    if (this.isBulkSchoolBill) {
      this.form.reset();
      this.form.clearValidators();
      this.form.updateValueAndValidity();
    }
  }
  getDerachServiceProviders() {
    // Getting the billers
    let lng = JSON.parse(this.cookieService.get("agtLang"));
    let token = this.cookieService.get("agt_token");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: lng.code,
      "x-auth-token": token,
      SERVICE_WRAPPER: "WRMAL_455",
    });

    return this.http
      .get<string>(`${environment.secureUrl}/`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        (response) => {
          let serviceProviders: any = this.encryption.decrypt(response);
          this.derachServiceProviders = serviceProviders.body;
          console.log(
            " this.derachServiceProviders",
            this.derachServiceProviders
          );
          this.error = "";
        },
        async (error) => {
          console.log("error=" + error);
          let response: any = this.encryption.decrypt(error.error);
          let response2: any = error;

          this.error = response.msgWithLanguage;
          if (response.status === 500) {
            this.error = await this.findLanguages.getTranslate("tech_issue");
          }
          this.toaster.showError(this.error);
          if (response2.status === 401) {
            this.authService.logoutUser();
          }
        }
      );
  }
}
