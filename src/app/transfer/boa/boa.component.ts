import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { NgProgress } from "ngx-progressbar";
import { AuthServiceService } from "app/_services/authentication-service";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgxSmartModalService } from "ngx-smart-modal";
import { TooltipPosition } from "@angular/material";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CustomValidation } from "app/_services/custom-validator.service";

import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import Swal from "sweetalert2";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { toasterService } from "app/_services/toaster-service";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-boa",
  templateUrl: "./boa.component.html",
  styleUrls: ["./boa.component.scss"],
})
export class BoaComponent implements OnInit {
  showLucyPayForm: boolean = true;

  pageTitle: string = "transfer-to-cbs";

  amountForm: FormGroup;
  walletForm: FormGroup;
  disableButton: boolean = false;
  showAlert: boolean = false;
  showMalForm: boolean = true;
  showBankForm: boolean = true;
  lucyPayMsg: boolean = false;
  BoaMsg: boolean = false;
  OtcMsg: boolean = false;
  page1: number = 0;
  page2: number = 0;
  transactions: any = [];
  showRecivedTransactions: boolean = false;
  error: any;
  walletId: any;
  showWalletError: boolean = false;
  beneficiary: any;
  isBenfExist: boolean = false;
  isBankBenfExist: boolean = false;
  isBankOTCExist: boolean = false;
  transferFees: any;
  transferFeesOTC: any;
  showFees: boolean = false;
  showFeesBank: boolean = false;
  showFeesOTC: boolean = false;
  selectedTransferedValue: any;
  modal: boolean = false;
  modalBank: boolean = false;
  modalOTC: boolean = false;
  bankForm: FormGroup;
  addBeneForm: FormGroup;
  otcForm: FormGroup;
  otcAddBeneForm: FormGroup;
  showAddBeneficiary: boolean = false;
  showAddBeneficiaryOTC: boolean = false;
  inquire: boolean = false;
  beneficiaries: any[];
  beneficiariesOTC: any[];
  idTypes: any[];
  branchTransactions: any[] = [];
  addedBeneficiaryName: any;
  addedBeneficiaryIban: any;
  // ToolTip
  position: TooltipPosition = "below";
  message: string = "Add new beneficiary";
  tooltips: string[] = [];
  disabled = false;
  showDelay = 0;
  hideDelay = 1000;
  showExtraClass = false;
  layoutDir = "ltr";

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

  timeLeft2: number = 30;
  interval2: any;

  page = 0;
  activePage = 0;
  pages = [];
  pageSize = 10;
  activePage2 = 0;
  pageSize2 = 10;

  public config: PerfectScrollbarConfigInterface = {};
  lucyPayAmount: any;
  LucyPaywalletNumber: string;
  boaAmount: any;
  boaAccountNumber: string;
  otcAmount: any;
  otcBene: any;
  inquiredBeneficiary_forOtherBankAccount: any;
  otherBankAccountFullName: any;
  fullName: any;
  otherBoaAccountNumber: any;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
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
    this.bankForm = this.fb.group({
      amount: [
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(30000),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ]),
      ],
      // iban: ["", Validators.compose([Validators.required])],
      addedBeneficiary: ["", Validators.compose([Validators.required])],
      description: [""],
      walletId: [""],
      boaAccount: [""],
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

    this.addBeneForm = this.fb.group({
      // addedBeneficiaryName: [null, Validators.compose([Validators.required])],
      addedBeneficiaryIban: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]),
      ],
    });
    this.getWalletId();
    this.getBeneficiary();
  }

  //not this
  getWalletId() {   
    this.httpClientService.httpClientMainRouter("WRMAL_046",`null`,"GET")
      .subscribe( res=>{
        let agentBalance = this._sharedService.decrypt(res).body;
        this.walletId = agentBalance[0].id;
      },err =>{
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

  showBoaMsg() {
    if (
      this.bankForm.controls.amount.valid &&
      this.bankForm.controls.addedBeneficiary.valid
    ) {
      this.boaAmount = this.bankForm.value.amount;
      if (this.sendToBankAccount) {
        this.bankForm
          .get("addedBeneficiary")
          .setValue(this.bankForm.value.boaAccount);

        this.inquireBeneficiary_forOtherBankAccount();

        this.otherBoaAccountNumber = this.bankForm.value.addedBeneficiary;
      } else {
        if (
          this.bankForm.get("addedBeneficiary").valid &&
          this.bankForm.get("amount").valid
        ) {
          this.BoaMsg = true;
        }
      }
      this.boaAccountNumber =
        this.bankForm.value.addedBeneficiary.boaAccountNumber;
    }
  }

  confirmTransferBOA(form) {
    if (
      this.bankForm.get("amount").valid &&
      this.bankForm.get("addedBeneficiary").valid &&
      this.bankForm.get("boaAccount").valid
    ) {
     
      
    let SERVICE_PARAM =
      "amount=" +
      form.value.amount +
      "&source=WEB&type=BANK_TRANSFER_AGENT&walletId=" +
      this.walletId +
      "&accountType=BUS";

      this.httpClientService.httpClientMainRouter("WRMAL_130",SERVICE_PARAM,"GET")
      .subscribe( res=>{
        let feesObj: any = this.encryption.decrypt(res).body;
        this.transferFees = {
          calcFees: feesObj.calcFeesRnd,
          destinationAmount: feesObj.destinationAmountRnd,
          destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
          sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
          sourceCode: feesObj.sourceCode,
          sourceAmountWfees: feesObj.sourceAmountWfees,
          description: this.bankForm.value.description,
        };
        if (form == this.amountForm) {
          this.showFees = !this.showFees;
          this.modal = !this.modal;
        }
        if (form == this.bankForm) {
          this.showFeesBank = !this.showFeesBank;
          this.modalBank = !this.modalBank;
        }
        this.BoaMsg = false;
      },err =>{
        console.log(err)
      });
    }
  }

  async createOTP_BOA(selectedTransferedValue, myForm3) {
    this.stopTimer();
    if (selectedTransferedValue) {
      if (this.bankForm.value.amount >= 0) {
        let body = {
          walletId: this.walletId,
          transactionTypeCode: "BANK_TRANSFER_AGENT",
          transactionSourceCode: "WEB",
          transactionAmount: this.bankForm.value.amount,
          description: this.bankForm.value.description,
        };
        this.httpClientService.httpClientMainRouter("WRMAL_193",`null`,"POST",body)
        .subscribe( res=>{
          let response = this._sharedService.decrypt(res)
          if (response.body.transactionOTPFlag == "true") {
            this.bankForm
              .get("otpCode")
              .setValidators([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(6),
                Validators.pattern(/^-?(0|[0-9]\d*)?$/),
              ]);
            this.showOTPForm_BOA = true;
            this.timeLeft = 60;
            this.startTimer(this.bankForm);
            console.log("otp", response.body.code);
          } else {
            this.bankForm.get("otpCode").setValue(null);
            this.bankForm.get("otpCode").clearValidators();
            this.bankForm.get("otpCode").updateValueAndValidity();
            this.transferModalCloseBank(selectedTransferedValue, myForm3);
          }
        
      },err =>{
        this.showOTPForm_BOA = false;
      });
      }
    }
  }

  async transferModalCloseBank(selectedTransferedValue, myForm3) {
    this.disableButton = true;
    this.bankForm.controls.otpCode.markAsTouched();
    if (this.bankForm.controls.otpCode.valid) {
      let bankAccount;
      if (this.sendToBankAccount) {
        this.bankForm
          .get("addedBeneficiary")
          .setValue(this.bankForm.value.boaAccount);

        bankAccount = this.bankForm.value.boaAccount;
      } else {
        bankAccount = this.bankForm.value.addedBeneficiary.boaAccountNumber;
      }
      let transferInfo = {
        destinationAmount: this.bankForm.value.amount,
        sourceCode: "WEB",
        sourceWalletId: this.walletId,
        destinationReference: bankAccount,
        feesFlag: selectedTransferedValue,
        otpCode: this.bankForm.value.otpCode,
        description: this.bankForm.value.description,
      };
      if (
        this.bankForm.get("amount").valid &&
        this.bankForm.get("addedBeneficiary").valid
      ) {
        if (selectedTransferedValue > 0) {
          this.httpClientService.httpClientMainRouter("WRMAL_467",`null`,"POST",transferInfo)
          .subscribe( async res=>{
            this.timeLeft2 = 30;
            this.disableButtonStartTimer();
            this.stopTimer();
            this.showOTPForm_BOA = false;
            let data: any = this._sharedService.decrypt(res);
            let doneMessage =
              await this.findAllLanguagesService.getTranslate(
                "operation_done"
              );
            this.toaster.showSuccess(doneMessage);
            // reset value after submitting
            this.selectedTransferedValue = 0;
            this.showFees = false;
            this.isBenfExist = false;
            this.modalBank = false;
            this.sendToBankAccount = false;
            // reset the form on submitting
            // this.walletForm.reset();
            this.bankForm.reset();
            //myForm.resetForm();
            // myForm2.resetForm();
          },err =>{
            console.log(err)
            this.timeLeft2 = 30;
            this.disableButtonStartTimer();
            this.selectedTransferedValue = 0;
          });
        } else {
          let msg = await this.findAllLanguagesService.getTranslate(
            "please-select-detuction-fees"
          );
          this.toaster.showError(msg);
        }
      }
    }
  }
  cancelOTP_BOA() {
    this.showOTPForm_BOA = false;
    this.modalBank = false;
    this.bankForm.reset();
    this.bankForm.get("otpCode").setValue(null);
  }
  bankTransfer(myForm3) {
    if (this.bankForm.valid) {
      // reset the form on submitting
      this.bankForm.reset();
      myForm3.resetForm();
      this.toaster.showSuccess("Success");
    }
  }
  selectBeneficiary() {
    console.log(
      "this.bankForm.value.addedBeneficiary",
      this.bankForm.value.addedBeneficiary
    );
    if (this.bankForm.value.addedBeneficiary == 1) {
      this.sendToBankAccount = true;
      this.bankForm
        .get("boaAccount")
        .setValidators([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ]);
    } else {
      this.sendToBankAccount = false;
      this.bankForm.get("boaAccount").setValidators(null);
      this.bankForm.get("boaAccount").setValue("");

      this.fullName = this.bankForm.value.addedBeneficiary.fullName;
      console.log("this.fullName", this.fullName);
    }
    // console.log("this.bankForm.value.bankAmount", this.bankForm.value.amount);
    // this.bankForm.controls["walletId"].setValue(
    //   this.bankForm.value.addedBeneficiary.code
    // );
  }
  cancelBeneficiary() {
    this.showAddBeneficiary = false;
    this.inquire = false;
    this.addBeneForm.reset();
  }
  /// the prb is here
  inquireBeneficiary() {
    if (this.addBeneForm.controls.addedBeneficiaryIban.valid) {
      let SERVICE_PARAM =  "accountNo=" + this.addBeneForm.value.addedBeneficiaryIban
      this.httpClientService.httpClientMainRouter("WRMAL_174",SERVICE_PARAM,"GET")
      .subscribe( res=> {
        this.inquire = true;
        this.inquiredBeneficiary = this._sharedService.decrypt(res).body;
      },err =>{
      });
    }
  }

  async inquireBeneficiary_forOtherBankAccount() {
    if (this.bankForm.controls.boaAccount.valid) {
      let SERVICE_PARAM = "accountNo=" + this.bankForm.value.boaAccount
      this.httpClientService.httpClientMainRouter("WRMAL_174",SERVICE_PARAM,"GET")
      .subscribe( res=>{
        let response = this._sharedService.decrypt(res)
        this.inquiredBeneficiary_forOtherBankAccount = response.body;
        this.otherBankAccountFullName = response.body.fullName;
        this.BoaMsg = true;
      },err =>{
      });
    }
  }
  // //not this
  async getBeneficiary() {
    this.httpClientService.httpClientMainRouter("WRMAL_158",`null`,"GET")
      .subscribe( res=>{
        this.beneficiaries = this._sharedService.decrypt(res).body;
      },err =>{
        console.log(err)
      });
  }

  async addBeneficiary(addBene) {
    this.addBeneForm.controls.addedBeneficiaryIban.markAsTouched();

    if (this.addBeneForm.valid) {
      // reset the form on submitting
      let body = {
        boaAccountNumber: this.addBeneForm.value.addedBeneficiaryIban,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_159",`null`,"POST",body)
      .subscribe( async res=>{
        this.addBeneForm.reset();
        addBene.resetForm();
        this.inquire = false;
        this.toaster.showSuccess(
          await this.findAllLanguagesService.getTranslate(
            "new Beneficiary has been added"
          )
        );
        this.getBeneficiary();
        this.cancelBeneficiary();
      },err =>{
        console.log(err)
      });
    }
  }

  async deleteBeneficiary(beneficiaryId) {
    Swal({
      title: await this.findLanguages.getTranslate("Are you sure?"),
      text: await this.findLanguages.getTranslate(
        "You won't be able to revert this!"
      ),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findLanguages.getTranslate(
        "Yes, delete it!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        let body = { id: beneficiaryId };
        this.httpClientService.httpClientMainRouter("WRMAL_160",`null`,"DELETE",body)
        .subscribe( async res=> {
          Swal(
            "Deleted!",
            await this.findLanguages.getTranslate(
              "The beneficiary has been deleted."
            ),
            "success"
          );
          this.getBeneficiary();
        
      },err =>{
        console.log(err)
      });
      }
    });
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
        if (form == this.otcForm) {
          this.otcForm.get("otpCode").setValue(null);
          this.showOTPForm_OTC = false;
        }
        if (form == this.bankForm) {
          this.bankForm.get("otpCode").setValue(null);
          this.showOTPForm_BOA = false;
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
