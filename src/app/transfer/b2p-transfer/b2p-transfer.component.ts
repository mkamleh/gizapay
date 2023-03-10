import { WrapperURLs } from "../../../environments/WrapperURLs";
import { Component, OnInit } from "@angular/core";
import { NgxSmartModalService } from "ngx-smart-modal";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { toasterService } from "app/_services/toaster-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CustomValidation } from "app/_services/custom-validator.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { environment } from "environments/environment";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-b2p-transfer",
  templateUrl: "./b2p-transfer.component.html",
  styleUrls: ["./b2p-transfer.component.scss"],
})
export class B2pTransferComponent implements OnInit {
  showLucyPayForm: boolean = true;

  pageTitle: string = "b2p-transfer";

  amountForm: FormGroup;
  walletForm: FormGroup;
  showMalForm: boolean = true;
  lucyPayMsg: boolean = false;
  walletId: any;
  beneficiary: any;
  isBenfExist: boolean = false;
  transferFees: any;
  transferFeesOTC: any;
  showFees: boolean = false;
  showFeesBank: boolean = false;
  showFeesOTC: boolean = false;
  selectedTransferedValue: any;
  modal: boolean = false;
  modalBank: boolean = false;
  modalOTC: boolean = false;
  showAddBeneficiary: boolean = false;
  showAddBeneficiaryOTC: boolean = false;
  inquire: boolean = false;
  beneficiaries: any[];
  beneficiariesOTC: any[];
  idTypes: any[];
  branchTransactions: any[] = [];

  addedBeneficiaryName: any;
  addedBeneficiaryIban: any;

  layoutDir = "ltr";
  disableButton: boolean = false;
  showAlert: boolean = false;
  timeLeft2: number = 30;
  interval2: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  inquiredBeneficiary: any;

  showOTPForm_LucyPay: boolean = false;
  showOTPForm_BOA: boolean = false;
  showOTPForm_OTC: boolean = false;

  sendToBankAccount: boolean = false; // not registered beneficiary

  timeLeft: number = 60;
  interval: any;
  page = 0;
  activePage = 0;
  pages = [];
  pageSize = 10;
  activePage2 = 0;
  pageSize2 = 10;
  lucyPayAmount: any;
  LucyPaywalletNumber: string;
  boaAmount: any;
  boaAccountNumber: string;
  otcAmount: any;
  otcBene: any;
  error: any;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    private httpClientService: HttpClientService,
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
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.walletId = this.cookieService.get("walletId");
  }
  ngOnInit() {
    this.walletForm = this.fb.group({
      wallet: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10),
          Validators.pattern(/^[+0-9]*$/),
        ]),
      ],
    });

    this.amountForm = this.fb.group({
      amount: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(30000),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      description: [""],
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

  searchBenf() {
    if (this.walletForm.valid) {
      let walletNumber = this.walletForm.value.wallet;
       this.httpClientService.httpClientMainRouter(WrapperURLs.b2p_transfer.searchBenf,
       "partnerId=1" + "&walletCode=" + walletNumber + "&accountType=CUS" ,"GET").
       subscribe( res=> {
        this.beneficiary = this._sharedService.decrypt(res).body;
        this.isBenfExist = true;
       },err =>{
       });
      // this.ngProgress.start();
    }
  }

  showLucyPayMsg() {
    if (this.amountForm.controls.amount.valid) {
      this.lucyPayAmount = this.amountForm.value.amount;
      this.LucyPaywalletNumber = "251" + this.walletForm.value.wallet;

      this.lucyPayMsg = true;
    }
  }
  confirmTransfer(form, el: HTMLElement) {
    // Getting fees
    if (this.amountForm.get("amount").valid) {
      let SERVICE_PARAM =
      "amount=" +
      this.amountForm.value.amount +
      "&source=WEB&type=WALLET_TO_CUSTOMER_WALLET_TRANSFER_AGENT&walletId=" +
      this.walletId;
      // this.ngProgress.start();
      this.httpClientService.httpClientMainRouter(
        WrapperURLs.b2p_transfer.confirmTransfer,
        SERVICE_PARAM,
        "GET")
        .subscribe( res=> {
          let transferObj: any = this.encryption.decrypt(res);
          let feesObj: any = transferObj.body;
          this.transferFees = {
            calcFees: feesObj.calcFeesRnd,
            destinationAmount: feesObj.destinationAmountRnd,
            destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
            sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
            sourceCode: feesObj.sourceCode,
            sourceAmountWfees: feesObj.sourceAmountWfees,
            description: this.amountForm.value.description,
          };
          if (form == this.amountForm) {
            this.showFees = !this.showFees;
            this.modal = !this.modal;
          }
          this.error = "";
          this.lucyPayMsg = false;
      },err =>{
      });
    }
  }
  async createOTP_lucyPay(selectedTransferedValue, myForm, myForm2) {
    this.stopTimer();
    console.log("send otp");
    if (selectedTransferedValue) {
      if (this.amountForm.value.amount >= 0) {
        let body = {
          walletId: this.walletId,
          transactionTypeCode: "WALLET_TO_CUSTOMER_WALLET_TRANSFER_AGENT",
          transactionSourceCode: "WEB",
          transactionAmount: this.amountForm.value.amount,
          description: this.amountForm.value.description,
        };
        this.httpClientService.httpClientMainRouter(WrapperURLs.b2p_transfer.createOTP_lucyPay
          ,`null`,"POST",body).subscribe( res=> {
            let response = this._sharedService.decrypt(res)
            if (response.body.transactionOTPFlag == "true") {
              this.amountForm
                .get("otpCode")
                .setValidators([
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(6),
                  Validators.pattern(/^-?(0|[0-9]\d*)?$/),
                ]);
              this.showOTPForm_LucyPay = true;
              this.timeLeft = 60;
              this.startTimer(this.amountForm);
              console.log("otp", response.body.code);
            } else {
              this.amountForm.get("otpCode").setValue(null);
              this.amountForm.get("otpCode").clearValidators();
              this.amountForm.get("otpCode").updateValueAndValidity();
              this.transferModalClose(selectedTransferedValue, myForm, myForm2);
            } 
        },err =>{
          this.showOTPForm_LucyPay = false;
        });
      }
    }
  }
  transferModalClose(selectedTransferedValue, myForm, myForm2) {
    this.disableButton = true;

    this.amountForm.controls.otpCode.markAsTouched();
    if (this.amountForm.controls.otpCode.valid) {
      let transferInfo = {
        destinationAmount: this.amountForm.value.amount,
        sourceCode: "WEB",
        sourceWalletId: this.walletId,
        destinationWalletCode: this.beneficiary.walletResource.code,
        feesFlag: selectedTransferedValue,
        otpCode: this.amountForm.value.otpCode,
        description: this.amountForm.value.description,
      };
      if (selectedTransferedValue > 0) {
        this.httpClientService.httpClientMainRouter(WrapperURLs.b2p_transfer.transferModalClose
          ,`null`,"POST",transferInfo).subscribe( async res=> {
            this.timeLeft2 = 30;
            this.disableButtonStartTimer();
            this.stopTimer();
            this.showOTPForm_LucyPay = false;
            let data: any = this.encryption.decrypt(res);
            let doneMessage = await this.findAllLanguagesService.getTranslate(
              "operation_done"
            );
            this.toaster.showSuccess(doneMessage);
            // reset value after submitting
            this.selectedTransferedValue = 0;
            this.showFees = false;
            this.isBenfExist = false;
            this.modal = false;
            // reset the form on submitting
            this.walletForm.reset();
            this.amountForm.reset();
            this.error = "";
        },err =>{
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          this.walletForm.reset();
          this.amountForm.reset();
          this.selectedTransferedValue = 0;
        });
      }
    }
  }
  cancelOTP_lucyPay() {
    this.showOTPForm_LucyPay = false;
    this.modal = false;
    this.isBenfExist = false;
    this.amountForm.reset();
    this.walletForm.reset();
    this.amountForm.get("otpCode").setValue(null);
  }
  startTimer(form) {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.stopTimer();
        if (form == this.amountForm) {
          this.amountForm.get("otpCode").setValue(null);
          this.showOTPForm_LucyPay = false;
        }
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
}
