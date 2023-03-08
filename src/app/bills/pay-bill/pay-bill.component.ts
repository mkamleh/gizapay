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
import { DatePipe } from "@angular/common";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-pay-bill",
  templateUrl: "./pay-bill.component.html",
  styleUrls: ["./pay-bill.component.scss"],
})
export class PayBillComponent implements OnInit {
  pageTitle: string = "Pay bill";
  payBillForm: FormGroup;
  form: FormGroup;
  Categories: any;
  billers: any;
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
  schoolBillerCode;
  showOTPForm: boolean = false;

  timeLeft: number = 60;
  interval: any;

  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  isOnline: boolean = false;
  isOffline: boolean = false;
  isDSTV: boolean = false;
  isTelecom: boolean = false;
  packages: any[] = [];
  onlineBillerName: void;
  isDSTVNewPackage: boolean = false;
  schoolAmount: any;
  isSchool: boolean = false;
  schoolBills: any[] = [];
  schoolBillId: any;
  isDerach: boolean = false;

  paymentTypeList = [
    {
      code: "accountCode ",
      name: "Account Number",
    },
    {
      code: "primaryIdentity ",
      name: "Service Number",
    },
  ];
  periodList = [
    {
      code: "1",
      name: "Month",
    },
    {
      code: "2",
      name: "Year",
    },
  ];

  dstvAmount;
  derachAmount;

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
  walletMobile: any;

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
    private encryption: Encryption,
    private datePipe: DatePipe,
    private httpClientService: HttpClientService,
    private _sharedServices: SharedService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.ngProgress.start();
    this.toaster.showWarning(
      "Bill Payment feature in maintenance... it will work soon!"
    );

    // this.getCategories();
    this.loadForm();
    this.getBillers("");
    this.getDerachServiceProviders();
    this.getPackages();
    this.getWalletId();
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
      smartCardNumber: [null, Validators.compose([Validators.required])],
      invoicePeriod: [null, Validators.compose([Validators.required])],
      subscriptionCode: [null, Validators.compose([Validators.required])],
      biller_id: [null, Validators.compose([Validators.required])],
      bill_id: [null, Validators.compose([Validators.required])],
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
    this.httpClientService.httpClientMainRouter("WRMAL_140","categoryId=" + code,"GET").subscribe( res=>{
      this.billers = this._sharedServices.decrypt(res).body;
      this.error = "";
    },err =>{
    });
  }

  async getBillInfo() {
    this.payBillForm.get("otpCode").clearValidators();
    this.payBillForm.get("otpCode").updateValueAndValidity();

    this.ngProgress.start();

    // Getting the bill info
    console.log("getBillInfo", this.payBillForm.value);
    this.toaster.showWarning(
      "Bill Payment feature in maintenance... it will work soon!"
    );
    this.ngProgress.done();
  }
  payBillFees() {
    this.ngProgress.start();
    if (!this.isOnline) {     
      var serviceParam = 
          "amount=" +
          this.billInfo.amountDue +
          "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
          this.walletId
      this.httpClientService.httpClientMainRouter("WRMAL_130",serviceParam,"GET").subscribe( res=>{
        let feesObj: any = this.encryption.decrypt(res).body;
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
      },err =>{
      });
    } else if (this.isOnline) {
      let amount = this.getAmountFromOnline();
      var serviceParam = "amount=" + amount +"&source=WEB&type=PAY_BILL_AGENT&walletId=" + this.walletId
      this.httpClientService.httpClientMainRouter("WRMAL_130",`null`,"GET").subscribe( res=>{
        let feesObj = this._sharedServices.decrypt(res).body;
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
      },err =>{
      });    
    }
  }
  payBillFees_School(amount, id?) {
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
      this.walletId = this.walletId;
      this.schoolAmount = amount;
      var serviceParam = "amount=" + amount + "&source=WEB&type=PAY_BILL_AGENT&walletId=" + this.walletId
      this.httpClientService.httpClientMainRouter("WRMAL_130",serviceParam,"GET").subscribe( res=>{
        let feesObj = this._sharedServices.decrypt(res).body;
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
        this.showEnterPayerInfo = false;
      },err =>{
      });
      
      if (id) {
        this.schoolBillId = id;
      }
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
      let body = {
        walletId: this.walletId,
        transactionTypeCode: "PAY_BILL_AGENT",
        transactionSourceCode: "WEB",
        transactionAmount: amount,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
      .subscribe( res=>{
        let response = this._sharedServices.decrypt(res);
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
        } else {
          this.payBillForm.get("otpCode").setValue(null);
          this.payBillForm.get("otpCode").clearValidators();
          this.payBillForm.get("otpCode").updateValueAndValidity();
          this.payBill(myForm);
        }
      },err =>{
        this.showOTPForm = false;
      });
    }
  }

  payBill(myForm) {
    if (this.isOffline) {
      this.payBillForm.controls.otpCode.markAsTouched();
      let body = {
        destinationAmount: this.billInfo.amountDueRnd,
        sourceCode: "WEB",
        billerCode: this.billInfo.billerCode,
        billNumber: this.billInfo.billNo,
        otpCode: this.payBillForm.value.otpCode,
      };
      if (this.payBillForm.valid) {
        this.httpClientService.httpClientMainRouter("WRMAL_460",`null`,"GET",body)
        .subscribe( async res=>{
          this.payedBill = this._sharedServices.decrypt(res).body;
          this.stopTimer();
          this.showOTPForm = false;
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
          this.error = "";
          this.error = "";
          this.showFirstCard = true;
        },err =>{
        });
      }
      } else if (this.isOnline) {
      this.payBillForm.controls.otpCode.markAsTouched();
      // Getting the billers
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      let token = this.cookieService.get("agt_token");

      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_449",
      });

      let data;
      if (this.isDSTV || this.isTelecom) {
        data = {
          billRefNumber: this.payBillForm.value.smartCardNumber,
          billerCode: this.payBillForm.value.biller.billerCode,
          mSISDN: this.payBillForm.value.mobile,
          packageID: this.payBillForm.value.packageId,
          requestID: "111111",
          sourceWalletId: this.walletId,
          sourceCode: "WEB",
          destinationAmount: this.getAmountFromOnline(),
          otpCode: this.payBillForm.value.otpCode,
          billRef: this.payBillForm.value.telecomeSubscriptionNumber,
          flag: this.payBillForm.value.telecomePaymentType,
          invoicePeriod: this.payBillForm.value.invoicePeriod,
        };
      }
      if (this.isDerach) {
        let WalletResourcesArray = this.adminLayout.getWalletId();
        this.walletMobile = WalletResourcesArray[0].mobileNumber;

        let myDate = new Date();
        let date = this.datePipe.transform(myDate, "yyyy-MM-ddThh:mm:ss");

        data = {
          amount: this.getAmountFromOnline(),
          destinationAmount: this.getAmountFromOnline(),
          bill_id: this.payBillForm.value.bill_id,
          manifast_id: this.billInfo.manifest_id,
          paid_at: "GIZAPAY",
          paid_dt: date,
          payee_mobile: this.walletMobile,
          txn_code: "PAYBILL",
          otpCode: this.payBillForm.value.otpCode,
          sourceCode: "WEB",
          sourceWalletId: this.walletId,
          billerCode: this.payBillForm.value.biller.billerCode,
          biller_id: this.payBillForm.value.biller_id.serviceProviderId,
        };
      }

      console.log("daataa>>>", data);

      if (this.payBillForm.valid) {
        let requestBody = this.encryption.encrypt(data);

        this.ngProgress.start();

        console.log("payBill", data);

        return this.http
          .post<string>(`${environment.secureUrl}`, requestBody, {
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
    } else if (this.isSchool) {
      if (this.isBulkSchoolBill) {
        this.payBulkSchoolBills();
      } else {
        this.payBillForm.controls.otpCode.markAsTouched();
        // Getting the billers
        let lng = JSON.parse(this.cookieService.get("agtLng"));
        let token = this.cookieService.get("agt_token");

        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          lng: lng.code,
          "x-auth-token": token,
          SERVICE_WRAPPER: "WRMAL_461",
        });

        let data = {
          id: this.schoolBillId,
          sourceCode: "WEB",
          otpCode: this.payBillForm.value.otpCode,
        };

        console.log("daataa>>>", data);

        if (this.payBillForm.valid) {
          let requestBody = this.encryption.encrypt(data);

          this.ngProgress.start();

          console.log("payBill", data);

          return this.http
            .post<string>(`${environment.secureUrl}`, requestBody, {
              headers,
              responseType: "text" as "json",
            })
            .subscribe(
              async (response) => {
                this.stopTimer();
                this.showOTPForm = false;
                let payBillObj: any = this.encryption.decrypt(response);
                this.payedBill = payBillObj.body;
                let doneMessage =
                  await this.findAllLanguagesService.getTranslate(
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
    console.log(
      "DDDDDDDDDDDDDDD",
      (this.schoolBillerCode = event.value.billerCode)
    );
    console.log(
      "DDDDDDDDDDDDDDD",
      (this.schoolBillerCode = event.value.billerCode)
    );
    console.log("biller >>", event);
    if (event.value.billerTypeCode == "online") {
      console.log("<< online >>");
      this.isOnline = true;
      this.isOffline = false;
      this.isSchool = false;
      this.disableOffline();
      this.disableSchool();
      let billerCode = event.value.billerCode;
      switch (billerCode) {
        case "DSTVBLR":
          this.disableTelecom();
          this.enableDstvForm(event);
          this.disableDerachForm();

          break;
        case "ETHIOTELE":
          this.disableDstvForm();
          this.enableTelecomForm(event);
          this.disableDerachForm();

          break;
        case "DEARACH":
          this.enableDerachForm(event);
          this.disableTelecom();
          this.disableDstvForm();

          break;
      }
    } else if (event.value.billerTypeCode == "offline") {
      console.log("<< offline >>");
      this.isOnline = false;
      this.isOffline = true;
      this.isSchool = false;
      this.enableOffline();
      this.disableDstvForm();
      this.disableTelecom();
      this.disableSchool();
      this.disableDerachForm();
    } else if (event.value.billerTypeCode == "SCHOOL") {
      console.log("<< SCHOOL >>");
      this.isOnline = false;
      this.isOffline = false;
      this.isSchool = true;
      this.disableOffline();
      this.disableDstvForm();
      this.disableTelecom();
      this.enableSchool();
      this.disableDerachForm();
    }
  }
  changePackage(event) {
    console.log("changePackage >>", event);
    if (event.value == "1") {
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
  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_046");
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
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
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    let token = this.cookieService.get("agt_token");

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: lng.code,
      "x-auth-token": token,
      SERVICE_WRAPPER: "WRMAL_455",
    });

    return this.http
      .get<string>(`${environment.secureUrl}`, {
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
