import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgxSmartModalService } from "ngx-smart-modal";
import { TooltipPosition } from "@angular/material";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CustomValidation } from "app/_services/custom-validator.service";
import { toasterService } from "app/_services/toaster-service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { Encryption } from "app/_services/Encryption";
import Swal from "sweetalert2";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-otc-send",
  templateUrl: "./otc-send.component.html",
  styleUrls: ["./otc-send.component.scss"],
})
export class OtcSendComponent implements OnInit {
  pageTitle: string = "otc-send";
  form: FormGroup;
  otpForm: FormGroup;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };

  walletId: any;
  transferFees: any;

  timeLeft: number = 60;
  interval: any;
  timeLeft2: number = 30;
  interval2: any;

  showFeesCard: boolean = false;
  showOTPCard: boolean = false;
  showAlert: boolean = false;
  disableButton: boolean = false;
  mobileNumber: any;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    public authService: AuthServiceService,
    public adminLayout: AdminLayoutComponent,
    public fb: FormBuilder,
    public findAllLanguagesService: FindAllLanguagesService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private _sharedService: SharedService,
    public findLanguages: FindAllLanguagesService,
    private encryption: Encryption,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.ngProgress.start();
    this.loadForm();
    this.getWalletId();
    this.ngProgress.done();
  }

  loadForm() {
    this.form = this.fb.group({
      amount: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(30000),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],

      senderFullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      senderMobileNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      senderIdentityNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern("[0-9]*$"),
        ]),
      ],

      receiverFullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      receiverMobileNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      receiverIdentityNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern("[^,!@#$%^&*()_+?/<>]+$"),
        ]),
      ],
    });
    this.otpForm = this.fb.group({
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
  }

  async OTC_send() {
    ///DONE
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
    (<any>Object).values(this.otpForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.form.valid && this.otpForm.valid) {
      let body = {
        destinationAmount: this.form.value.amount,
        senderFullName: this.form.value.senderFullName,
        senderMobileNo: this.form.value.senderMobileNo,
        senderIdentityNo: this.form.value.senderIdentityNo,
        receiverFullName: this.form.value.receiverFullName,
        receiverIdentityNo: this.form.value.receiverIdentityNo,
        sourceCode: "WEB",
        receiverMobileNo: this.form.value.receiverMobileNo,
        otp: this.otpForm.value.otpCode,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_380",`null`,"POST",body)
      .subscribe( async res => {
        Swal({
          title: await this.findAllLanguagesService.getTranslate("otc-sent"),
          type: "success",
          showCancelButton: false,
          showCloseButton: true,
        });
        this.form.reset();
        Object.keys(this.form.controls).forEach((key) => {
          this.form.get(key).setErrors(null);
        });

        this.timeLeft2 = 30;
        this.disableButtonStartTimer();
        this.stopTimer();
        this.showOTPCard = false;
      },err =>{
        console.log(err)
        this.timeLeft2 = 30;
        this.disableButtonStartTimer();
      });
    }
  }

  async getFees() {
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.form.valid) {
      let SERVICE_PARAM =  "amount=" +
      this.form.value.amount +
      "&source=WEB&type=OTC_TRANSFER_AGENT&walletId=" +
      this.walletId +
      "&accountType=BUS";
      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res);
        this.showFeesCard = true;
        let feesObj: any = response.body;
        this.transferFees = {
          calcFees: feesObj.calcFeesRnd,
          destinationAmount: feesObj.destinationAmountRnd,
          destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
          sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
          sourceCode: feesObj.sourceCode,
          sourceAmountWfees: feesObj.sourceAmountWfees,
        };
        this.mobileNumber = "+251" + this.form.value.receiverMobileNo;
      },err =>{
        console.log(err)
      });
    }
  }
  async getOTP() {
    this.stopTimer();
    console.log("send otp");
    if (this.form.value.amount >= 0) {
      let body = {
        walletId: this.walletId,
        transactionTypeCode: "OTC_TRANSFER_AGENT",
        transactionSourceCode: "WEB",
        transactionAmount: this.form.value.amount,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
      .subscribe( res => {
        let response = this._sharedService.decrypt(res)
        if (response.body.transactionOTPFlag == "true") {
          this.otpForm
            .get("otpCode")
            .setValidators([
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(6),
              Validators.pattern(/^-?(0|[0-9]\d*)?$/),
            ]);
          this.showOTPCard = true;
          this.showFeesCard = false;
          this.timeLeft = 60;
          this.startTimer(this.otpForm);
          console.log("otp", response.body.code);
        } else {
          this.showOTPCard = false;
          this.showFeesCard = false;
          this.otpForm.get("otpCode").setValue(null);
          this.otpForm.get("otpCode").clearValidators();
          this.otpForm.get("otpCode").updateValueAndValidity();
          this.OTC_send();
        }
      },err =>{
        this.showOTPCard = false;
      });
      
    }
  }

  getWalletId() {
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET")
      .subscribe( res =>{
        let agentBalance = this._sharedService.decrypt(res);
        this.walletId = agentBalance[0].id;
      },err =>{
        console.log(err)
      });
  }
  startTimer(form) {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();

        this.otpForm.get("otpCode").setValue(null);
        this.showOTPCard = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
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
  cancel() {
    this.showOTPCard = false;
    this.showFeesCard = false;
    this.otpForm.reset();
    this.otpForm.get("otpCode").setValue(null);
  }
}
