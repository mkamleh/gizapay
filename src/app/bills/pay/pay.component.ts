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
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.scss"],
})
export class PayComponent implements OnInit {
  showFees: boolean = false;
  disableButton: boolean = false;
  showAlert: boolean = false;
  timeLeft2: number = 30;
  interval2: any;
  selectedTransferedValue: any;

  layoutDir: any;
  payBillForm: FormGroup;
  token: string;
  lng: any;
  categories: any;
  error: string;
  billers: any;
  showBillInfo: boolean = false;
  billInfo: any;
  disabled: boolean;
  pageTitle: any = "pay";
  showErrorMsg: boolean;
  errorMsg: any;
  showConfirm: boolean = false;
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
  paymentFees: any;
  // paymentFees: {
  //   calcFees: any;
  //   destinationAmount: any;
  //   destinationAmountWOfees: any;
  //   sourceOperationCurrencyCode: any;
  //   sourceCode: any;
  //   sourceAmountWfees: any;
  //   initiationOperationCurrencyCaption: any;
  // };
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
    private encryption: Encryption,
    private httpClientService: HttpClientService,
    private _sharedServices: SharedService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.token = this.cookieService.get("agt_token");
    this.lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", this.lng);
    this.layoutDir = this.lng.direction;
  }

  ngOnInit() {
    this.payBillForm = this.fb.group({
      category: ["", Validators.compose([Validators.required])],
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
  }

  getBillInfo() {
    let billNo = this.payBillForm.controls["billNo"].value;
    this.httpClientService.httpClientMainRouter("WRMAL_142",`billNo=${billNo}`,"GET")
      .subscribe( res=>{
        let billInfoObj: any = this._sharedService.decrypt(res);
        this.billInfo = billInfoObj.body;
        if (this.billInfo) {
          this.showBillInfo = true;
          this.showConfirm = false;
          if (this.billInfo.statusId != "7") {
            this.disabled = false;
          } else {
            this.disabled = true;
          }
        }
      },err =>{
      });
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
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET")
      .subscribe( res=>{
        let agentBalance = this._sharedService.decrypt(res).body;
        this.walletId = agentBalance[0].id;
      },err =>{
        console.log(err)
      });

    
  }
  getTransactionOtp() {
    this.stopTimer();

     let body = {
      walletId: this.walletId,
      transactionTypeCode: "PAY_BILL_AGENT",
      transactionSourceCode: "WEB",
      transactionAmount: this.billInfo.amountDue,
    };

    this.httpClientService.httpClientMainRouter("WRMAL_193","null","POST",body)
      .subscribe( res=>{
        let response = this._sharedService.decrypt(res)
        if (response.body.transactionOTPFlag == "true") {
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
         // this.ngProgress.done();;
        } else {
          this.payBillForm.get("otp").setValue(null);
          this.payBillForm.get("otp").clearValidators();
          this.payBillForm.get("otp").updateValueAndValidity();
          this.payBill();
        }
      },err =>{
      });
  }


  payBillFees() {
    this.getWalletId();
    let SERVICE_PARAM = "amount=" + this.billInfo.amountDue +
    "&source=WEB&type=PAY_BILL_AGENT&walletId=" + this.walletId

    this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res=>{
        let feesObj: any = this._sharedService.decrypt(res).body;
        this.paymentFees = {
            calcFees: feesObj.calcFeesRnd,
            destinationAmount: feesObj.destinationAmountRnd,
            destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
            sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
            sourceCode: feesObj.sourceCode,
            sourceAmountWfees: feesObj.sourceAmountWfees,
            sourceAmountWOfeesRnd: feesObj.sourceAmountWOfeesRnd,
            initiationOperationCurrencyCaption:
              feesObj.initiationOperationCurrencyCaption,
        };
          this.showFees = !this.showFees;
          this.showFeesDiv();   
      },err =>{
        console.log(err)
      });
  }

  async payBill() {
    console.log("pay");

    if (this.billInfo) {
      let destinationReference = this.billInfo.sadadNo;
      let body: any = {
        destinationReference: destinationReference,
        otpCode: this.payBillForm.value.otp,
        destinationAmount: this.paymentFees.destinationAmountWOfeesRnd,
        sourceCode: "WEB",
        sourceWalletId: this.walletId,
      };

      this.httpClientService.httpClientMainRouter("WRMAL_045",`null`,"POST",body)
      .subscribe( async res=>{
        this.timeLeft2 = 30;
        this.disableButtonStartTimer();
        let payBillObj: any = this.encryption.decrypt(res);
        let doneMessage = await this.findAllLanguagesService.getTranslate(
          "operation_done"
        );
        this.toaster.showSuccess(doneMessage);
        this.payBillForm.get("billNo").setValue("");
        this.billInfo = {};
        this.showBillInfo = false;
        this.showConfirm = false;
        this.showOtp = false;
        this.showFees = false;
        this.payBillForm.reset();
      },err =>{
        console.log(err)
      });

    } else {
      let msg = await this.findAllLanguagesService.getTranslate(
        "please-select-detuction-fees"
      );

      this.toaster.showError(msg);
    }
  }

  showConfirmDiv() {
    this.showConfirm = true;
    this.showBillInfo = false;
    this.showFees = false;
  }
  showFeesDiv() {
    console.log("Iam Here");

    this.showConfirm = false;
    this.showBillInfo = false;
    this.showFees = true;
    this.showOtp = false;
  }
  cancelPayMoney() {
    this.showConfirm = false;
    this.showOtp = false;
    this.showFees = false;
    this.showBillInfo = true;
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
