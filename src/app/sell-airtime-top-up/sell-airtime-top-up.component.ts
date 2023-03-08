import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { Router } from "@angular/router";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { environment } from "environments/environment";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SharedService } from "app/_services/shared-service";
import { toasterService } from "app/_services/toaster-service";
import { HttpService } from "app/_services/HttpService";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-sell-airtime-top-up",
  templateUrl: "./sell-airtime-top-up.component.html",
  styleUrls: ["./sell-airtime-top-up.component.scss"],
})
export class SellAirtimeTopUpComponent implements OnInit {
  pageTitle: string = "sell-airtime-top-up";
  modal: boolean = false;
  walletId: any;
  transferFees: any;
  airtimeForm: FormGroup;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  showOTPForm: boolean = false;
  timeLeft: number = 60;
  interval: any;
  error: any;
  walletNumber: any;
  mobileNumber: any;

  timeLeft2: number = 30;
  interval2: any;
  disableButton: boolean = false;
  showAlert: boolean = false;
  constructor(
    private _sharedService: SharedService,
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    public authService: AuthServiceService,
    private toaster: toasterService,
    private router: Router,
    private fb: FormBuilder,
    private httpService: HttpService,
    public adminLayout: AdminLayoutComponent,
    public findAllLanguagesService: FindAllLanguagesService,
    public findLanguages: FindAllLanguagesService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
    // let WalletResourcesArray = this.adminLayout.getWalletId();
    // this.walletId = WalletResourcesArray[0].id;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.airtimeForm = this.fb.group({
      mobile: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10),
          Validators.pattern(/^-?(0|[+0-9]\d*)?$/),
        ]),
      ],
      amount: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(30000),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      otpCode: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]),
      ],
    });
    this.ngProgress.done();
    this.getWalletId();
  }
  getWalletId() {  
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET")
      .subscribe( res => {
        let agentBalance = this._sharedService.decrypt(res).body;
        this.walletId = agentBalance[0].id;
      },err =>{
        console.log(err)
      });
    
  }

  async showFeesForm() {
    this.mobileNumber = "+251" + this.airtimeForm.value.mobile;
    this.airtimeForm.controls.amount.markAsTouched();
    this.airtimeForm.controls.mobile.markAsTouched();
    if (
      this.airtimeForm.get("mobile").valid &&
      this.airtimeForm.get("amount").valid
    ) {
      // Getting fees
      let SERVICE_PARAM =
      "amount=" +
      this.airtimeForm.value.amount +
      "&source=WEB&type=AIRTIME_TOPUP_AGENT&walletId=" +
      this.walletId

      return this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res => {
        let transferObj: any = this.encryption.decrypt(res);
        let feesObj: any = transferObj.body;
        this.transferFees = {
          calcFees: feesObj.calcFeesRnd,
          destinationAmount: feesObj.destinationAmountRnd,
          destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
          sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
          sourceCode: feesObj.sourceCode,
          sourceAmountWfees: feesObj.sourceAmountWfeesRnd,
          initiationOperationCurrencyCaption:
          feesObj.initiationOperationCurrencyCaption,
        };
        this.modal = !this.modal;
      },err =>{
        console.log(err)
      });
    }
  }
  async createOTP() {
    this.stopTimer();
    console.log("send otp");

    if (this.airtimeForm.value.amount >= 0) {
      let body = {
        walletId: this.walletId,
        transactionTypeCode: "AIRTIME_TOPUP_AGENT",
        transactionSourceCode: "WEB",
        transactionAmount: this.airtimeForm.value.amount,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
      .subscribe( res => {
        let response = this._sharedService.decrypt(res)
        if (response.body.transactionOTPFlag == "true") {
          this.airtimeForm
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
          this.airtimeForm.get("otpCode").setValue(null);
          this.airtimeForm.get("otpCode").clearValidators();
          this.airtimeForm.get("otpCode").updateValueAndValidity();
          this.load();
        }
      },err =>{
        this.showOTPForm = false;
      });
    }
  }
  async load() {
    this.disableButton = true;
    this.airtimeForm.controls.otpCode.markAsTouched();
    ///// add T Code for service
    let body = {
      destinationAmount: this.airtimeForm.value.amount,
      sourceCode: "WEB",
      sourceWalletId: this.walletId,
      destinationReference: "251" + this.airtimeForm.value.mobile,
      otpCode: this.airtimeForm.value.otpCode,
    };
    if (this.airtimeForm.valid) {
      this.httpClientService.httpClientMainRouter("WRMAL_192",`null`,"POST",body)
      .subscribe( async res => {
        this.timeLeft2 = 30;
        this.disableButtonStartTimer();
        this.stopTimer();
        this.toaster.showSuccess(
          await this.findAllLanguagesService.getTranslate("operation_done")
        );
        this.modal = false;
        this.showOTPForm = false;
        this.airtimeForm.reset();
      }, err =>{
        this.timeLeft2 = 30;
        this.disableButtonStartTimer();
      });
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        this.airtimeForm.get("otpCode").setValue(null);
        this.showOTPForm = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }
  cancelOTP() {
    this.modal = false;
    this.showOTPForm = false;
    this.airtimeForm.get("otpCode").setValue(null);
  }

  disableButtonStartTimer() {
    this.interval2 = setInterval(() => {
      if (this.timeLeft2 > 0) {
        this.timeLeft2--;
        this.showAlert = true;
      } else {
        this.disableButtonStopTimer();
        this.disableButton = false;
        this.showAlert = false;
      }
    }, 1000);
  }
  disableButtonStopTimer() {
    clearInterval(this.interval2);
  }
}
