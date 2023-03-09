/** @format */

import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { Component, OnInit, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { environment } from "environments/environment";
import { AuthServiceService } from "app/_services/authentication-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { toasterService } from "../../_services/toaster-service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  DateAdapter,
  MAT_DATE_FORMATS,
} from "@angular/material";
import { DatePipe } from "@angular/common";
import { SharedService } from "app/_services/shared-service";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/shared/format-datepicker";
import { CustomValidation } from "app/_services/custom-validator.service";
import { HttpService } from "app/_services/HttpService";
import * as $ from "jquery";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-cash-in",
  templateUrl: "./cash-in.component.html",
  styleUrls: ["./cash-in.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class CashInComponent implements OnInit {
  moneyAmount: any;
  generatedCode: any;
  isCodeGenerated: boolean = false;
  walletId: any;
  cashInFees: any;
  showFees: boolean = false;
  cashInHistory: any;
  cashInForm: FormGroup;
  showWalletInfo: false;

  /////history table
  showHistory: boolean = false;
  customerProfileResource: any;
  walletResources: any;
  count = 50;
  offset = 0;
  rows: any = [];
  temp: any = [];
  columns: any = [];
  showAmountError: boolean = false;
  error: string;
  layoutDir = "ltr";
  showInfo: boolean = false;
  wallet: any;
  idTypes: any;
  countries: any;
  receiptInfo: any = {};
  today = Date.now();
  minDate = new Date();
  pageTitle: string = "cash_in";
  showErrorMsg: boolean;
  errorMsg: any;
  showOtpField = false;
  generatedOtp: boolean;

  timeLeft: number = 60;
  showOtp: boolean;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  interval;
  showConfirm: boolean;

  feesObject: any;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    public adminLayout: AdminLayoutComponent,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private authService: AuthServiceService,
    public fb: FormBuilder,
    public findAllLanguagesService: FindAllLanguagesService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private httpService: HttpService,
    private customValidation: CustomValidation,
    public _sharedService: SharedService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }
  async ngOnInit() {
    this.cashInForm = this.fb.group({
      moneyAmount: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      walletCode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      // fullName: ["", Validators.compose([Validators.required])],
      fullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      idType: ["", Validators.compose([Validators.required])],
      idNum: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern("[^,!@#$%^&*()_+?/<>]+$"),
        ]),
      ],
      idCountry: [
        null,
        Validators.compose([
          // Validators.required,
        ]),
      ],
      // idIssueDate: ["", Validators.compose([Validators.required])],
      idExpairyDate: ["", Validators.compose([Validators.required])],
      otp: [null],
    });

    // this.onRefresh();
    this.getIdentityTypes();
    // this.getCountries();
  }
  getIdentityTypes() {
    this.httpClientService.httpClientMainRouter("WRMAL_095",`null`,"GET")
      .subscribe( res => {
        this.idTypes = this.encryption.decrypt(res).body;
      },err =>{
      });
  }

  getWalletInfo() {
    // this.ngProgress.start();
    if (this.cashInForm.controls["walletCode"].valid) {
      let walletToSearch = this.cashInForm.controls["walletCode"].value;
      this.httpClientService.httpClientMainRouter("WRMAL_039",`code=${walletToSearch}`,"GET")
      .subscribe( res =>{
        this.wallet = this._sharedService.decrypt(res).body;
        this.showInfo = !this.showInfo;
      },err =>{
        this.showInfo = false;
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentDialog, {
      data: this.receiptInfo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async getTransactionOtp() {
    this.stopTimer();
    let body = {
      walletId: this.walletId,
      transactionTypeCode: "CASHIN_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.cashInForm.value.moneyAmount,
      mobileNo: this.cashInForm.value.walletCode,
    };

    this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
      .subscribe( res =>{
        let otpObj = this._sharedService.decrypt(res).body;
        let transactionOTPFlag = otpObj.transactionOTPFlag;
        const otp = this.cashInForm.get("otp");
        if (transactionOTPFlag == "true") {
          this.timeLeft = 60;
          this.startTimer();
          this.showConfirm = false;
          this.showOtp = true;
         // this.ngProgress.done();;
          this.cashInForm
            .get("otp")
            .setValidators([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern("^[0-9]*$"),
            ]);
        } else {
          this.cashInForm.get("otp").setValidators(null);
          this.cashInForm.get("otp").clearValidators();
          this.cashInService();
      }
      otp.updateValueAndValidity();
        
      },err =>{
        this.cashInForm.reset();
      });      
  }

  cashIn() {
    this.markFormGroupTouched(this.cashInForm.controls);

    console.log("this.cashInForm.valid", this.cashInForm.valid);
    console.log("this.cashInForm.controls", this.cashInForm.controls);

    if (this.cashInForm.valid) {
      // confirming cash in
      this.cashInService();
    } else {
      console.log("XXX", this.cashInForm.validator);
    }
  }

  cashInOtp() {
    console.log("cashInOtp");
    if (this.cashInForm.valid) {
      this.getTransactionOtp();
    } else {
      console.log("XXX", this.cashInForm.validator);
    }
  }

  async cashInService() {
    // this.ngProgress.start();
    let token = this.cookieService.get("agt_token");
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    let data: any = {
      destinationAmount: this.cashInForm.value.moneyAmount,
      destinationWalletCode: this.cashInForm.value.walletCode,
      idFullName: this.cashInForm.value.fullName,
      identityNo: this.cashInForm.value.idNum,
      identityTypeId: this.cashInForm.value.idType.identityTypeId,
      idIssueCountryId: this.cashInForm.value.idCountry
        ? this.cashInForm.value.idCountry.countryId
        : null,
      idIssueDate: this.datepipe.transform(
        this.cashInForm.value.idIssueDate,
        "yyyy-MM-dd'T'00:00:00"
      ),
      idExpiryDate: this.datepipe.transform(
        this.cashInForm.value.idExpairyDate,
        "yyyy-MM-dd'T'00:00:00"
      ),
      otpCode: this.cashInForm.value.otp,
      sourceCode: "WEB",
    };
    this.receiptInfo = data;
    if (this.wallet) {
      this.receiptInfo.holderName = this.wallet.holderName;
    }
    this.httpClientService.httpClientMainRouter("WRMAL_040",`null`,"POST",data)
      .subscribe( async res =>{
        let cashInCardObj: any = this.encryption.decrypt(res);
        let doneMessage = await this.findAllLanguagesService.getTranslate(
          "operation_done"
        );
        this.receiptInfo.destinationAmount = cashInCardObj.body.destinationAmountRnd;
        this.receiptInfo.transactionNo = cashInCardObj.body.id;
        this.receiptInfo.calcFees = cashInCardObj.body.calcFeesRnd;
        this.receiptInfo.vat = cashInCardObj.body.vat;
        this.receiptInfo.initiationOperationCurrencyCaption = cashInCardObj.body.initiationOperationCurrencyCaption;
        this.showOtp = false;
        this.cashInForm.get("otp").setValue("");
        this.toaster.showSuccess(doneMessage);
        setTimeout(() => this.openDialog(), 1500);
        this.showConfirm = false;
        this.cashInForm.reset();
       // this.ngProgress.done();;
        this.wallet = null;
        this.showInfo = false;
        this.error = "";
      },err =>{
        console.log(err)
      });
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

  private markFormGroupTouched(controls) {
    // (<any>Object).values(controls).forEach((control) => {
    //   control.markAsTouched();
    // });
    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.cashInForm.get("otp").setValue(null);
        this.cashInForm.get("otp").setValidators(null);
        this.cashInForm.get("otp").clearValidators();
        this.cashInForm.get("otp").updateValueAndValidity();
        this.showOtp = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }
  showConfirmDiv() {
    this.markFormGroupTouched(this.cashInForm.controls);
    this.cashInForm.get("otp").setValidators(null);
    this.cashInForm.get("otp").updateValueAndValidity();
    if (this.cashInForm.valid) {
      this.getFees();
      // this.showBillInfo = false;
    } else {
      console.log(">>>", this.cashInForm);
    }
  }
  cancelPayMoney() {
    this.showConfirm = false;
    // this.showBillInfo = true;
  }

  getFees() {
    // Getting fees
   
      let SERVICE_PARAM =
        "amount=" +
        this.cashInForm.value.moneyAmount +
        "&source=WEB&type=CASHIN_AGENT&walletId=0";
  
    this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res =>{
        this.feesObject = this.encryption.decrypt(res).body;
        this.showConfirm = true;
      },err =>{
      });
  }
}

// import { MD_DIALOG_DATA } from "@angular/material";
// import { Inject } from "@angular/core";
@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogContentDialog {
  today = Date.now();
  layoutDir;
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialog>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any // public cashOut: CashOutComponent
  ) {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    // will log the entire data object
    console.log("from DialogContentDialog", this.data);
  }
}
