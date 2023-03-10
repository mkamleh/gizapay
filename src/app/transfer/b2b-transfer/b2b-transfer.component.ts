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
  selector: "app-b2b-transfer",
  templateUrl: "./b2b-transfer.component.html",
  styleUrls: ["./b2b-transfer.component.scss"],
})
export class B2bTransferComponent implements OnInit {
  pageTitle: string = "b2b-transfer";
  walletId: any;
  showOTPForm: boolean = false;
  isAgent: boolean = false;
  isMerchant: boolean = false;
  modal: boolean = false;
  showMsg: boolean = false;
  form: FormGroup;
  beneficiary: any;
  isBenfExist: boolean = false;
  error: any;
  W2B_Amount: any;
  W2B_walletNumber: any;
  showAlert: boolean = false;
  timeLeft2: number = 30;
  interval2: any;
  transferFees: any;
  selectedTransferedValue: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  timeLeft: number = 60;
  interval: any;
  disableButton: boolean = false;
  showFees: boolean = false;
  layoutDir = "ltr";

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    public ngProgress: NgProgress,
    private toaster: toasterService,
    private httpClientService: HttpClientService,
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
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      wallet: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(/^[+0-9]*$/),
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

  searchBenf() {
    if (this.form.get("wallet").valid) {
      let walletNumber = this.form.value.wallet;
      this.httpClientService.httpClientMainRouter(
        WrapperURLs.b2b_transfer.searchBenf,
        "accountType=BUS" + "&walletCode=" + walletNumber
        ,"GET").
        subscribe( res=> {
          let benfObj: any = this.encryption.decrypt(res);
          this.beneficiary = benfObj.body;
          this.isBenfExist = true;
          if (benfObj.body.merchantProfileResource == null) {
            this.isAgent = true;
            this.isMerchant = false;
          }
          if (benfObj.body.agentProfileResource == null) {
            this.isAgent = false;
            this.isMerchant = true;
          }
         // this.ngProgress.done();;
          this.error = "";
        },err => {
          this.isBenfExist = false;
        });
    }
  }
  show_W2B_Msg() {
    if (this.form.controls.amount.valid) {
      this.W2B_Amount = this.form.value.amount;
      this.W2B_walletNumber = this.form.value.wallet;

      this.showMsg = true;
    }
  }
  async createOTP(selectedTransferedValue, myForm, myForm2) {
    this.stopTimer();
    if (selectedTransferedValue) {
      if (this.form.value.amount >= 0) {
        let body = {
          walletId: this.walletId,
          transactionTypeCode: "WALLET_TO_BUSINESS_WALLET_TRANSFER_AGENT",
          transactionSourceCode: "WEB",
          transactionAmount: this.form.value.amount,
          description: this.form.value.description,
        };
       
        this.httpClientService.httpClientMainRouter(
          WrapperURLs.b2b_transfer.createOTP,
          `null`,"POST",body)
          .subscribe( res=> {
            let response = this._sharedService.decrypt(res)
            if (response.body.transactionOTPFlag == "true") {
              this.form
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
              this.form.get("otpCode").setValue(null);
              this.form.get("otpCode").clearValidators();
              this.form.get("otpCode").updateValueAndValidity();
              this.transferModalClose(selectedTransferedValue, myForm, myForm2);
            }
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

        this.form.get("otpCode").setValue(null);
        this.showOTPForm = false;
      }
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.interval);
  }

  transferModalClose(selectedTransferedValue, myForm, myForm2) {
    this.disableButton = true;
    this.form.controls.otpCode.markAsTouched();
    if (this.form.controls.otpCode.valid) {
      let transferInfo = {
        destinationAmount: this.form.value.amount,
        sourceCode: "WEB",
        sourceWalletId: this.walletId,
        destinationWalletCode: this.beneficiary.walletResource.code,
        feesFlag: selectedTransferedValue,
        otpCode: this.form.value.otpCode,
        description: this.form.value.description,
      };
      if (selectedTransferedValue > 0) {
        this.httpClientService.httpClientMainRouter(
          WrapperURLs.b2b_transfer.transferModalClose,
          `null`,"GET",transferInfo).subscribe( async res=> {
            this.timeLeft2 = 30;
            this.disableButtonStartTimer();
            this.stopTimer();
            this.showOTPForm = false;
            let data: any = this.encryption.decrypt(res);
            let doneMessage = await this.findAllLanguagesService.getTranslate(
              "operation_done"
            );
            this.toaster.showSuccess(doneMessage);
            console.log("Transfer P2P: Close", data);
            // reset value after submitting
            this.selectedTransferedValue = 0;
            this.showFees = false;
            this.isBenfExist = false;
            this.modal = false;
            // reset the form on submitting
            this.form.reset();
            this.error = "";
          
          },err =>{
          });
      }
    }
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
  cancelOTP() {
    this.showOTPForm = false;
    this.modal = false;
    this.isBenfExist = false;
    this.form.reset();
    this.form.get("otpCode").setValue(null);
  }
  confirmTransfer(form, el: HTMLElement) {
    // Getting fees
    if (this.form.get("amount").valid) {
      let SERVICE_PARAM =
          "amount=" +
          this.form.value.amount +
          "&source=WEB&type=WALLET_TO_BUSINESS_WALLET_TRANSFER_AGENT&walletId=" +
          this.walletId;

      // this.ngProgress.start();
      this.httpClientService.httpClientMainRouter(
        WrapperURLs.b2b_transfer.confirmTransfer,
        SERVICE_PARAM,"GET")
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
          description: this.form.value.description,
        };
        if (form == this.form) {
          this.showFees = !this.showFees;
          this.modal = !this.modal;
        }
        this.error = "";
        this.showMsg = false;
        
        },err =>{
        });
    }
  }
}
