/** @format */

import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { DatePipe } from "@angular/common";
import { environment } from "environments/environment";
import { SharedService } from "app/_services/shared-service";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/shared/format-datepicker";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-otc",
  templateUrl: "./otc.component.html",
  styleUrls: ["./otc.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class OtcComponent implements OnInit {
  layoutDir = "ltr";
  otcInfo: any;
  otcForm: FormGroup;
  transactionInfoObj: any;
  showInfo: boolean;
  error: string;
  minDate = new Date();
  idTypes: any;
  countries: any;
  pageTitle: string = "otc";
  showErrorMsg: boolean;
  errorMsg: any;
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
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    this.otcForm = this.fb.group({
      // moneyAmount: [
      //   "",
      //   Validators.compose([
      //     Validators.required,
      //     Validators.min(1),
      //     Validators.max(9999.99),
      //     Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
      //   ]),
      // ],
      refNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      fullName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(60),
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
      idIssueDate: ["", Validators.compose([Validators.required])],
      idExpairyDate: ["", Validators.compose([Validators.required])],
    });
    this.getIdentityTypes();
    this.getCountries();
  }
  getIdentityTypes() {
    this.httpClientService.httpClientMainRouter("WRMAL_095",`null`,"GET")
      .subscribe( res => {
        let identitiesObj: any = this.encryption.decrypt(res);
        this.idTypes = identitiesObj.body;
      },err =>{
        console.log(err)
      });
  }
  getCountries() {
    
    this.httpClientService.httpClientMainRouter("WRMAL_086",`null`,"GET")
      .subscribe( res => {
        let countriesObj: any = this.encryption.decrypt(res);
        this.countries = countriesObj.body;
      },err =>{
        console.log(err)
      });
  }

  getTransactionInfo() {
    if (this.otcForm.controls["refNumber"].value) {
      let walletToSearch = this.otcForm.controls["refNumber"].value;
      return this.httpClientService.httpClientMainRouter("WRMAL_050",`TXNRef=${walletToSearch}`,"GET")
      .subscribe( res => {
        let searchedObj: any = this.encryption.decrypt(res);
        this.transactionInfoObj = searchedObj.body;
        if (this.transactionInfoObj) {
          this.otcForm
            .get("fullName")
            .setValue(this.transactionInfoObj.reserveName);
            this.transactionInfoObj.refNumber = walletToSearch;
        }
        console.log("searchedObj", searchedObj);
        this.showInfo = !this.showInfo;
        this.error = "";
        if (!this.showInfo) {
          this.otcForm.get("refNumber").setValue("");
        }
      },err =>{
        console.log(err)
      });
    }
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentDialog3, {
      data: this.transactionInfoObj,
    });
    console.log("data passed to dialog", this.transactionInfoObj);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  confirmRecivedTransaction() {
    if (this.otcForm.valid) {
      let data = { id: this.transactionInfoObj.id };
      return this.httpClientService.httpClientMainRouter("WRMAL_051",`null`,"PUT",data)
      .subscribe( async res => {
        let searchedObj: any = this.encryption.decrypt(res);
        let doneMessage = await this.findAllLanguagesService.getTranslate(
          "operation_done"
        );
        this.transactionInfoObj.calcFees = searchedObj.body.calcFeesRnd;
        this.transactionInfoObj.initiationOperationCurrencyCaption =
            searchedObj.body.initiationOperationCurrencyCode;
        this.toaster.showSuccess(doneMessage);
        setTimeout(() => this.openDialog(), 1500);
        this.otcForm.reset();
        this.showInfo = false;
        this.error = "";
      },err =>{
        console.log(err)
      });
    }
  }
}

@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogContentDialog3 {
  today = Date.now();
  layoutDir;
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialog3>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any // public cashOut: CashOutComponent
  ) {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    // will log the entire data object
    console.log("from DialogContentDialog3", this.data);
  }
}
