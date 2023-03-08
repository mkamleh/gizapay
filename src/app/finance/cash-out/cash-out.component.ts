/** @format */

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
} from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { SharedService } from "app/_services/shared-service";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/shared/format-datepicker";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-cash-out",
  templateUrl: "./cash-out.component.html",
  styleUrls: ["./cash-out.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class CashOutComponent implements OnInit {
  moneyAmount: any;
  walletId: any;
  cashOutFees: any;
  showFees: boolean = false;
  cashOutHistory: any;
  cashOutForm: FormGroup;
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
  otp: any;
  today = Date.now();
  receiptInfo: any = {};
  minDate = new Date();
  pageTitle: string = "cash_out";
  showOtpField = false;
  timeLeft: number = 60;
  interval;
  showErrorMsg: boolean;
  errorMsg: any;
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
    this.cashOutForm = this.fb.group({
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
      fullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern("^[a-zA-Z ]*$"),
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
        "",
        Validators.compose([
          // Validators.required,
        ]),
      ],
      // idIssueDate: ["", Validators.compose([Validators.required])],
      idExpairyDate: ["", Validators.compose([Validators.required])],
      otp: [""],
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
    if (this.cashOutForm.controls["walletCode"].valid) {
      let walletToSearch = this.cashOutForm.controls["walletCode"].value;
      let SERVICE_PARAM =`code=${walletToSearch}`;
      this.httpClientService.httpClientMainRouter("WRMAL_039",SERVICE_PARAM,"GET")
      .subscribe( res => {
        let searchedObj: any = this.encryption.decrypt(res);
        this.wallet = searchedObj.body;
        if (this.wallet) {
          this.cashOutForm.get("fullName").setValue(this.wallet.holderName);
          this.receiptInfo.holderName = this.wallet.holderName;
          this.receiptInfo.mobileNumber = this.wallet.mobileNumber;
          this.receiptInfo.email = this.wallet.email;
        }           
        this.showInfo = !this.showInfo;
      },err =>{
        console.log(err)
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentDialog1, {
      data: this.receiptInfo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getTransactionOtp() {
    this.stopTimer();
    this.ngProgress.start();
    this.markFormGroupTouched(this.cashOutForm.controls);
   
   
    let data: any = {
      walletId: this.walletId,
      transactionTypeCode: "CASHOUT_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.cashOutForm.value.moneyAmount,
      mobileNo: this.cashOutForm.value.walletCode,
    };
    this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",data)
      .subscribe( res =>{
        let cashOutCardObj: any = this.encryption.decrypt(res);
        let otpObj = cashOutCardObj.body;
        let transactionOTPFlag = otpObj.transactionOTPFlag;
        const otp = this.cashOutForm.get("otp");
        if (transactionOTPFlag == "true") {
          this.timeLeft = 60;
          this.startTimer();
          this.showConfirm = false;
          this.showOtpField = true;
          this.ngProgress.done();
          this.cashOutForm
            .get("otp")
            .setValidators([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern("^[0-9]*$"),
            ]);
        } else {
          this.cashOutForm.get("otp").setValidators(null);
          this.cashOutForm.get("otp").clearValidators();
          this.cashOut();
        }
        otp.updateValueAndValidity();
      },err =>{
        console.log(err)
      });
  }

  cashOutOtp() {
    this.stopTimer();
    this.ngProgress.start();
    this.markFormGroupTouched(this.cashOutForm.controls);
    if (this.cashOutForm.valid) {
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      let data: any = {
        sourceAmount: this.cashOutForm.value.moneyAmount,
        sourceWalletCode: this.cashOutForm.value.walletCode,
        idFullName: this.cashOutForm.value.fullName,
        identityNo: this.cashOutForm.value.idNum,
        identityTypeId: this.cashOutForm.value.idType.identityTypeId,
        idIssueCountryId: this.cashOutForm.value.idCountry.countryId,
        idIssueDate: this.datepipe.transform(
          this.cashOutForm.value.idIssueDate,
          "yyyy-MM-dd'T'00:00:00"
        ),
        idExpiryDate: this.datepipe.transform(
          this.cashOutForm.value.idExpairyDate,
          "yyyy-MM-dd'T'00:00:00"
        ),
      };

      this.httpClientService.httpClientMainRouter("WRMAL_041",`null`,"POST",data)
      .subscribe( res =>{
        let cashOutCardObj: any = this.encryption.decrypt(res);
        this.cashOutForm
          .get("otp")
          .setValidators([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
            Validators.pattern("^[0-9]*$"),
          ]);
          this.cashOutForm.get("otp").updateValueAndValidity();
          this.showOtpField = true;
          console.log("otp from service", this.otp);
          this.timeLeft = 60;
          this.startTimer();
          this.showConfirm = false;
      },err =>{
        console.log(err)
      });
    }
    // }
  }
  cashOut() {
    this.markFormGroupTouched(this.cashOutForm.controls);
    this.ngProgress.start();
    // this.openDialog2();
    if (this.cashOutForm.valid) {
      // confirming cash in
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      let data: any = {
        otpCode:
          this.cashOutForm.value.otp == null ? "" : this.cashOutForm.value.otp,
        sourceAmount: this.cashOutForm.value.moneyAmount,
        sourceWalletCode: this.cashOutForm.value.walletCode,
        idFullName: this.cashOutForm.value.fullName,
        identityNo: this.cashOutForm.value.idNum,
        identityTypeId: this.cashOutForm.value.idType.identityTypeId,
        idIssueCountryId:
          this.cashOutForm.value.idCountry == null
            ? null
            : this.cashOutForm.value.idCountry.countryId,
        idIssueDate: this.datepipe.transform(
          this.cashOutForm.value.idIssueDate,
          "yyyy-MM-dd'T'00:00:00"
        ),
        idExpiryDate: this.datepipe.transform(
          this.cashOutForm.value.idExpairyDate,
          "yyyy-MM-dd'T'00:00:00"
        ),
        sourceCode: "WEB",
      };
      this.receiptInfo = data;
      if (this.wallet) {
        this.receiptInfo.holderName = this.wallet.holderName;
      }
      let requestBody = this.encryption.encrypt(data);
      this.httpClientService.httpClientMainRouter("WRMAL_042",`null`,"POST")
      .subscribe( async res =>{
        let cashOutCardObj: any = this.encryption.decrypt(res);
        let doneMessage = await this.findAllLanguagesService.getTranslate(
              "operation_done"
        );
        this.receiptInfo.sourceAmount = cashOutCardObj.body.sourceAmountRnd;
        this.receiptInfo.transactionNo = cashOutCardObj.body.transactionNo;
        this.receiptInfo.calcFees = cashOutCardObj.body.calcFeesRnd;
        this.receiptInfo.vat = cashOutCardObj.body.vat;
        this.receiptInfo.initiationOperationCurrencyCaption =
        cashOutCardObj.body.initiationOperationCurrencyCaption;
        this.toaster.showSuccess(doneMessage);
        setTimeout(() => this.openDialog(), 1500);
        this.cashOutForm.reset();
        this.stopTimer();
        this.showOtpField = false;
        this.wallet = null;
        this.showInfo = false;
        this.showConfirm = false;
      },err =>{
        console.log(err)
      });
    }
  }
  showConfirmDiv() {
    this.markFormGroupTouched(this.cashOutForm.controls);
    this.cashOutForm.get("otp").setValidators(null);
    this.cashOutForm.get("otp").updateValueAndValidity();
    if (this.cashOutForm.valid) {
      this.getFees();
    }
    console.log("this.cashOutForm.valid", this.cashOutForm.valid);
    console.log("this.cashOutForm.controls", this.cashOutForm.controls);
  }
  cancelPayMoney() {
    this.showConfirm = false;
    // this.showBillInfo = true;
  }
  private markFormGroupTouched(controls) {
    // (<any>Object).values(controls).forEach((control) => {
    //   control.markAsTouched();
    // });
    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
    });
  }

  //OTP timer
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.cashOutForm.get("otp").setValue("");
        this.cashOutForm.get("otp").setValidators(null);
        this.cashOutForm.get("otp").clearValidators();
        this.cashOutForm.get("otp").updateValueAndValidity();
        this.showOtpField = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }

  getFees() {
    // Getting fees
    let SERVICE_PARAM =
    "amount=" +
    this.cashOutForm.value.moneyAmount +
    "&source=WEB&type=CASHOUT_AGENT&walletId=0";

    this.ngProgress.start();
    this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res => {
        this.feesObject = this.encryption.decrypt(res).body;
        this.showConfirm = true;
      },err =>{
        console.log(err)
      });
  }
}

@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog1.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogContentDialog1 {
  today = Date.now();
  layoutDir;
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialog1>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any // public cashOut: CashOutComponent
  ) {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    // will log the entire data object
    console.log("from DialogContentDialog1", this.data);
  }
}
