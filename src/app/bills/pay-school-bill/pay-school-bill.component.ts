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
import { HttpClientService } from "app/_services/HttpClientService";

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
    private encryption: Encryption,
    private httpClientService: HttpClientService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.toaster.showWarning(
      "Bill Payment School feature in maintenance... it will work soon!"
    );
    this.loadForm();
    // this.ngProgress.start();
    // this.getCategories();
    this.getBillers("");
    // this.getDerachServiceProviders();
    // this.getPackages();
   // this.ngProgress.done();;
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
    this.httpClientService.httpClientMainRouter("WRMAL_456","categoryId=" + code,"GET")
    .subscribe( res=>{
      let billersObj: any = this.encryption.decrypt(res);
      this.billers = billersObj.body;
      this.orginalBillers = billersObj.body;
      this.error = "";
    },err =>{
    });
  }

  async getBillInfo() {
    this.payBillForm.get("otpCode").clearValidators();
    this.payBillForm.get("otpCode").updateValueAndValidity();

    // this.ngProgress.start();
    this.toaster.showWarning(
      "Bill Payment School feature in maintenance... it will work soon!"
    );
   // this.ngProgress.done();;

    // Getting the bill info
    console.log("getBillInfo", this.payBillForm.value);
   // this.ngProgress.done();;
  }
  async payBillFees() {
    // this.ngProgress.start();
    if (this.isOffline) {
      // Getting the billers
      let lng = JSON.parse(this.cookieService.get("agtLang"));
      let token = this.cookieService.get("agt_token");
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray[0].id;
      let SERVICE_PARAM =
        "amount=" +
        this.billInfo.amountDue +
        "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
        this.walletId;
      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET").
      subscribe( res=>{
        let paymentFeesObj: any = this.encryption.decrypt(res);
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
        this.error = "";
      },err =>{
      });
    } else if (this.isOnline) {
      let amount = this.getAmountFromOnline();
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray[0].id;      
      let SERVICE_PARAM = 
        "amount=" +
        amount +
        "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
        this.walletId;  
      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
        .subscribe( res=>{
          let feesObj = this._sharedService.decrypt(res).body;  
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
      let WalletResourcesArray = this.adminLayout.getWalletId();
      this.walletId = WalletResourcesArray;
      let SERVICE_PARAM = 
        "amount=" +
        amount +
        "&source=WEB&type=PAY_BILL_AGENT&walletId=" +
        this.walletId;
      this.schoolAmount = amount;
      if (id) {
        this.schoolBillId = id;
      }
      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res=>{
        this.feesObj = this._sharedService.decrypt(res).body;
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
      },err =>{
      });
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

      this.httpClientService.httpClientMainRouter("WRMAL_183","null","POST",body)
        .subscribe( res=>{
          let response = this._sharedService.decrypt(res)
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
        },err =>{
        });
    }
  }

  payBill(myForm) {
    if (this.isBulkSchoolBill) {
      this.payBulkSchoolBills();
    } else {
      this.payBillForm.controls.otpCode.markAsTouched();
      let data = {
        billId: this.schoolBillId,
        destinationAmount: this.paymentFees.destinationAmount,
        sourceCode: "WEB",
        otpCode: this.payBillForm.value.otpCode,
      };


      if (this.payBillForm.valid) {
        this.httpClientService.httpClientMainRouter("WRMAL_461","null","GET",data)
        .subscribe( async res=> {
          this.stopTimer();
          this.showOTPForm = false;
          let payBillObj: any = this.encryption.decrypt(res);
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

         // this.ngProgress.done();;
        },err =>{
        });
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

  getPackages() {
    this.httpClientService.httpClientMainRouter("WRMAL_448","null","GET")
    .subscribe( res=>{
      this.packages = this._sharedService.decrypt(res).body;
      this.error = "";
    },err =>{
    });
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
      let response = await this.httpService.http_request(this.request_options);
      this.httpClientService.httpClientMainRouter("WRMAL_455",`billerId=${billerId}`,"GET")
      .subscribe( res=>{
        this.schoolProducts = this._sharedService.decrypt(res).body;
        this.showSchoolCard1 = false;
        this.showSingleSchoolBills = false;
        this.showSchoolProducts = true;
      },err =>{
      });
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

  getBulkSchoolBills() {
    if (this.schoolProductsArray.length == 0) {
      this.toaster.showError(" Please Select Product!");
      return;
    }
    let billerId = this.payBillForm.value.biller.id;
    let body = {
      subscriptionCode: this.payBillForm.value.subscriptionCode,
      billerId: billerId,
      productList: this.schoolProductsArray,
    };
    this.httpClientService.httpClientMainRouter("WRMAL_453","null","POST",body)
    .subscribe( res=>{
      this.bulkSchoolBills = this._sharedService.decrypt(res).body.schoolInvoiceResourceList;
      this.showSchoolCard1 = false;
      this.showSingleSchoolBills = false;
      this.showSchoolProducts = false;
      this.showBulkSchoolBills = true;
    },err =>{
    });
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
    let body = {
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
    if (this.payBillForm.valid) {
      this.httpClientService.httpClientMainRouter("WRMAL_459","null","POST",body)
      .subscribe( async res=> {
        this.stopTimer();
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
    },err =>{
    });
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
    return this.httpClientService.httpClientMainRouter("WRMAL_455","null","GET")
    .subscribe( res=> {
      this.derachServiceProviders = this.encryption.decrypt(res).body;
      this.error = "";
    },err =>{
    });
  }
}
