import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MatStepper,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { toasterService } from "app/_services/toaster-service";
import { FileUploader } from "ng2-file-upload";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import Swal from "sweetalert2";
import { environment } from "environments/environment";
import { HttpClientService } from "app/_services/HttpClientService";
import { Encryption } from "app/_services/Encryption";
import { ErrorHandling } from "app/_services/ErrorHandling";


@Component({
  selector: "app-create-customer",
  templateUrl: "./create-customer.component.html",
  styleUrls: ["./create-customer.component.scss"],
})
export class CreateCustomerComponent implements OnInit {
  public loading = false;

  @ViewChild("stepper",{static: false}) private myStepper: MatStepper;
  pageTitle: string = "create-customer";
  public personalForm: FormGroup;
  public addressForm: FormGroup;
  public accountForm: FormGroup;
  cardTitle: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  minDate = new Date();
  minBirthDate = new Date(
    this.minDate.setFullYear(this.minDate.getFullYear() - 18)
  );

  idTypes: any[] = [];
  today = new Date();

  fileName1: string = "";
  fileName2: string = "";
  fileName3: string = "";

  public uploader: FileUploader = new FileUploader({
    itemAlias: "photo",
  });
  showOtherRegion: boolean = false;
  showOtherCity: boolean = false;
  showOtherSubCity: boolean = false;
  cities: any[];
  regions: any[];
  subcities: any[];
  createdWallet: any;

  accountId: number;
  sub: any;
  accountInfo: any;

  isSubmitForm: boolean = false;
  isUpdate: boolean = false;
  showFileValidation: boolean = false;
  mobileNumForSub: any;
  mobileRetrive: any;
  constructor(
    public findAllLanguagesService: FindAllLanguagesService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private _sharedService: SharedService,
    private ngProgress: NgProgress,
    private errorHandling: ErrorHandling,
    private toaster: toasterService,
    public datepipe: DatePipe,
    private encryption: Encryption,
    private authService: AuthServiceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private httpClientService: HttpClientService,
    private cookieService: CookieService
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }
  ngOnInit() {
    // this.ngProgress.start();
    this.loadForm();
    this.getIdentityTypes();
    this.getRegions();

    this.sub = this.route.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.accountId = +params["accountId"] || 0;
      console.log("accountId", this.accountId);
      if (this.accountId) {
        this._sharedService.emitChange(this.pageTitle);
        this.getAccount();
      }
    });
   // this.ngProgress.done();;
  }

  loadForm() {
    this.personalForm = this.fb.group({
      firstName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      secondName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],
      motherName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
        ]),
      ],

      birthDate: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      idNumber: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
          Validators.pattern("[0-9]*$"),
        ]),
      ],

      idType: ["", Validators.compose([Validators.required])],
      identityIssueDate: ["", Validators.compose([Validators.required])],
      identityExpiryDate: ["", Validators.compose([Validators.required])],
    });
    this.addressForm = this.fb.group({
      regionId: [null, Validators.compose([Validators.required])],
      cityId: [null, Validators.compose([Validators.required])],
      subcityId: [null, Validators.compose([Validators.required])],
      cityOther: [null],
      regionOther: [null],
      subCityOther: [null],
      woreda: ["", Validators.compose([Validators.required])],
      houseNo: ["", Validators.compose([Validators.required])],
    });
    this.accountForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.minLength(8),
          Validators.maxLength(254),
        ]),
      ],
      mobileNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      attachmentOne: [null],
      attachmentTwo: [null],
      attachmentThree: [null],
      t24AccountNum: [null],
    });
  }

  onFileUpload(controlName, fileName) {
    this.uploader.onAfterAddingFile = (file) => {
      if (fileName == "fileName1") {
        this.fileName1 = file._file.name;
      } else if (fileName == "fileName2") {
        this.fileName2 = file._file.name;
      } else if (fileName == "fileName3") {
        this.fileName3 = file._file.name;
      }
      file.withCredentials = false;
      let reader = new FileReader();
      let myFile: File;
      myFile = file._file;
      reader.readAsDataURL(myFile);
      reader.onload = () => {
        this.accountForm.get(controlName).setValue(reader.result);
      };
      console.log(this.accountForm.controls);
    };
  }

  /////// get parameters

  getIdentityTypes() {
    this.httpClientService.httpClientMainRouter("WRMAL_095","null","GET")
    .subscribe((response:any)=> {
      response = this._sharedService.decrypt(response)
      let identitiesObj: any = response;
      this.idTypes = identitiesObj.body;
      console.log("hiii")
    }
    , (err) =>{
      console.log("hiii", err)
    }); 
  }

  getRegions() {
    this.httpClientService.httpClientMainRouter("WRMAL_172","null","GET")
    .subscribe((response:any)=> {
      response = this._sharedService.decrypt(response)
      this.regions = response.body;
    }
    , (err) =>{
    }); 
  }
  getCities(regionId) {
    this.httpClientService.httpClientMainRouter("WRMAL_173",`regionId=${regionId}`,"GET")
    .subscribe((response:any)=> {
      response = this._sharedService.decrypt(response)
      this.cities = response.body;
    }
    , (err) =>{
    }); 
  }

  getSubcity(cityId) {
    this.httpClientService.httpClientMainRouter("WRMAL_171",`cityId=${cityId}`,"GET")
    .subscribe((response:any)=> {
      response = this._sharedService.decrypt(response)
      this.subcities = response.body;
    }
    , (err) =>{
    }); 
    
  }

  regionChange(event) {
    if (event) {
      if (this.addressForm.controls["regionId"].value == 2) {
        this.addressForm
          .get("regionOther")
          .setValidators([Validators.required]);
        this.addressForm.get("regionOther").updateValueAndValidity();
        this.showOtherRegion = true;
      } else {
        this.showOtherRegion = false;
        this.addressForm.get("regionOther").clearValidators();
        this.addressForm.get("regionOther").updateValueAndValidity();
      }
    }
  }
  cityChange(event) {
    if (event) {
      this.getSubcity(event);
      if (this.addressForm.controls["cityId"].value == 162) {
        this.addressForm.get("cityOther").setValidators([Validators.required]);
        this.addressForm.get("cityOther").updateValueAndValidity();
        this.showOtherCity = true;
      } else {
        this.showOtherCity = false;
        this.addressForm.get("cityOther").clearValidators();
        this.addressForm.get("cityOther").updateValueAndValidity();
      }
    }
  }
  subCityChange(event?) {
    if (event) {
      if (this.addressForm.controls["subcityId"].value == 40) {
        this.addressForm
          .get("subCityOther")
          .setValidators([Validators.required]);
        this.addressForm.get("subCityOther").updateValueAndValidity();
        this.showOtherSubCity = true;
      } else {
        this.showOtherSubCity = false;
        // this.form.get("subCityOther").setValidators(null);
        this.addressForm.get("subCityOther").clearValidators();
        this.addressForm.get("subCityOther").updateValueAndValidity();
      }
    }
  }

  /////// methods

  completeStep1() {
    (<any>Object).values(this.personalForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.personalForm.valid) {
      this.myStepper.next();
    }
  }
  completeStep2() {
    (<any>Object).values(this.addressForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.addressForm.valid) {
      this.myStepper.next();
    }
  }
  completeStep3() {
    console.log("im here");

    ///DONE Create Customer
    (<any>Object).values(this.accountForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    if (this.accountForm.valid) {
      this.loading = true;

      let birthDate = this.datepipe.transform(
        this.personalForm.value.birthDate,
        "yyyy-MM-dd"
      );
      let identityIssueDate = this.datepipe.transform(
        this.personalForm.value.identityIssueDate,
        "yyyy-MM-dd"
      );
      let identityExpiryDate = this.datepipe.transform(
        this.personalForm.value.identityExpiryDate,
        "yyyy-MM-dd"
      );
      let body = {
        firstName: this.personalForm.value.firstName,
        secondName: this.personalForm.value.secondName,
        lastName: this.personalForm.value.lastName,
        motherName: this.personalForm.value.motherName,
        mobileNo: this.accountForm.value.mobileNo,
        email: this.accountForm.value.email,
        gender: this.personalForm.value.gender,
        identityNo: this.personalForm.value.idNumber,
        attachmentOne: this.accountForm.value.attachmentOne
          ? this.accountForm.value.attachmentOne
          : null,
        attachmentTwo: this.accountForm.value.attachmentTwo
          ? this.accountForm.value.attachmentTwo
          : null,
        attachmentThree: this.accountForm.value.attachmentThree
          ? this.accountForm.value.attachmentThree
          : null,
        birthDate: birthDate,
        identityIssueDate: identityIssueDate,
        identityExpiryDate: identityExpiryDate,
        identityTypeId: this.personalForm.value.idType.identityTypeId,
        t24AccountNum: this.accountForm.value.t24AccountNum,
        cityId: this.addressForm.value.cityId,
        subCityId: this.addressForm.value.subcityId,
        regionId: this.addressForm.value.regionId,
        cityOther: this.addressForm.value.cityOther,
        subCityOther: this.addressForm.value.subCityOther,
        regionOther: this.addressForm.value.regionOther,
        woreda: this.addressForm.value.woreda,
        houseNo: this.addressForm.value.houseNo,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_047",`cityId=${this.addressForm.value.cityId}`,"POST",body)
        .subscribe(
          response => {
          response = this._sharedService.decrypt(response)
          this.onSuccessCustomerCreate(response)
          this.loading = false;          
        }, 
          (err)=>{
            this.loading = false;
          }
      )
    }
  }

  ////
  async onSuccessCustomerCreate(response){
    this.createdWallet = response;

    Swal({
      title: await this.findAllLanguagesService.getTranslate(
        "customer-created"
      ),
      type: "success",
      showCancelButton: false,
      showCloseButton: true,
    });
      setTimeout(() => this.openDialog(), 2500);  
      this.personalForm.reset();
      this.addressForm.reset();
      this.accountForm.reset();  
      this.myStepper.reset();
      this.fileName1 = "";
      this.fileName2 = "";
      this.fileName3 = "";
  }
  ///



  openDialog() {
    // const dialogRef = this.dialog.open(DialogContentDialog2);
    const dialogRef = this.dialog.open(DialogContentDialog2, {
      data: this.createdWallet.body,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async handleMobileNo(mobileNumber: string) {
    if (mobileNumber.startsWith("+251")) {
      return (this.mobileNumForSub = mobileNumber.substring(4));
    } else {
      return (this.mobileNumForSub = mobileNumber);
    }
  }
  ///// update
  getAccount() {
    this.pageTitle = "Update Customer";
    this._sharedService.emitChange(this.pageTitle);
    this.httpClientService.httpClientMainRouter("WRMAL_399",`customerId=${this.accountId}`,"GET")
      .subscribe(
        response => {
          response = this._sharedService.decrypt(response)
          this.updateCustomerForm(response)
        }, 
        (err)=>{
        });
      
    }

  updateCustomerForm(response){
    this.isUpdate = true;
      this.accountInfo = response.body;
      console.log(" this.accountInfo", this.accountInfo);
      this.mobileNumForSub = response.body.mobileNo;
      console.log(this.mobileNumForSub, "this.mobileNumForSubBefore");

      this.handleMobileNo(this.mobileNumForSub);

      console.log(this.mobileNumForSub, "this.mobileNumForSub");

      this.personalForm.get("firstName").setValue(this.accountInfo.firstName);
      this.personalForm.get("secondName").setValue(this.accountInfo.secondName);
      this.personalForm.get("lastName").setValue(this.accountInfo.lastName);
      this.personalForm
        .get("motherName")
        .setValue(
          this.accountInfo.motherName ? this.accountInfo.motherName : ""
        );
      this.personalForm
        .get("birthDate")
        .setValue(this.parseDate(this.accountInfo.birthDate));
      this.personalForm.get("gender").setValue(this.accountInfo.gender);
      this.personalForm
        .get("idNumber")
        .setValue(
          this.accountInfo.identityNo ? this.accountInfo.identityNo : ""
        );
      this.personalForm
        .get("identityIssueDate")
        .setValue(
          this.accountInfo.identityIssueDate
            ? this.parseDate(this.accountInfo.identityIssueDate)
            : ""
        );
      this.personalForm
        .get("identityExpiryDate")
        .setValue(
          this.accountInfo.identityExpiryDate
            ? this.parseDate(this.accountInfo.identityExpiryDate)
            : ""
        );

      //////
      let identityTypeId = this.idTypes.find(
        (x) => x.identityTypeId == this.accountInfo.identityTypeId
      );
      this.personalForm
        .get("idType")
        .setValue(identityTypeId ? identityTypeId : "");
      console.log("iiii", identityTypeId);
      //////

      this.accountForm.get("email").setValue(this.accountInfo.email);
      // this.accountForm.controls["email"].disable();

      this.accountForm.get("mobileNo").setValue(this.mobileNumForSub);
      this.accountForm.controls["mobileNo"].disable();

      this.accountForm
        .get("attachmentOne")
        .setValue(this.accountInfo.attachmentOne);
      this.fileName1 = this.accountInfo.attachmentOne;
      this.fileName2 = this.accountInfo.attachmentTwo;
      this.fileName3 = this.accountInfo.attachmentThree;
      this.accountForm.controls["attachmentOne"].disable();

      this.accountForm
        .get("attachmentTwo")
        .setValue(this.accountInfo.attachmentTwo);
      this.accountForm.controls["attachmentTwo"].disable();
      this.accountForm
        .get("attachmentThree")
        .setValue(this.accountInfo.attachmentThree);
      this.accountForm.controls["attachmentThree"].disable();

      this.accountForm
        .get("t24AccountNum")
        .setValue(this.accountInfo.t24AccountNum);
      this.accountForm.controls["t24AccountNum"].disable();

      this.addressForm.get("woreda").setValue(this.accountInfo.woreda);
      this.addressForm.get("houseNo").setValue(this.accountInfo.houseNo);

      this.getCities(this.accountInfo.regionId);
      this.getSubcity(this.accountInfo.cityId);

      this.addressForm.get("regionId").setValue(this.accountInfo.regionId);
      this.addressForm.get("cityId").setValue(this.accountInfo.cityId);
      this.addressForm.get("subcityId").setValue(this.accountInfo.subCityId);

      // other
      if (this.accountInfo.regionId == 2) {
        this.regionChange(this.accountInfo.regionId);
        //  this.loadType(response.body.region.id);
        this.addressForm.get("regionOther").setValue(response.body.regionOther);
      }
      if (this.accountInfo.cityId == 162) {
        this.cityChange(this.accountInfo.cityId);
        this.addressForm.get("cityOther").setValue(response.body.cityOther);
      }
      if (this.accountInfo.subCityId == 40) {
        this.subCityChange(this.accountInfo.subCityId);
        this.addressForm
          .get("subCityOther")
          .setValue(response.body.subCityOther);
      }
    }
  
  parseDate(date) {
    console.log("date", date);

    let dayOfMonth = date.dayOfMonth.toString();
    if (dayOfMonth.length < 2) {
      dayOfMonth = "0" + dayOfMonth;
    }

    let monthValue = date.monthValue.toString();
    if (monthValue.length < 2) {
      monthValue = "0" + monthValue;
    }

    let year = date.year;

    return year + "-" + monthValue + "-" + dayOfMonth;
  }

  async updateCustomer() {
    (<any>Object).values(this.accountForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    // this.isSubmitForm = true;

    // if (!this.accountForm.get("attachmentOne").valid) {
    //   this.showFileValidation = true;
    // }

    // if (this.accountForm.valid) {
    this.loading = true;

    let birthDate = this.datepipe.transform(
      this.personalForm.value.birthDate,
      "yyyy-MM-dd"
    );
    let identityIssueDate = this.datepipe.transform(
      this.personalForm.value.identityIssueDate,
      "yyyy-MM-dd"
    );
    let identityExpiryDate = this.datepipe.transform(
      this.personalForm.value.identityExpiryDate,
      "yyyy-MM-dd"
    );
    //QuickFix :cause of mobileNo is disable js cant take data :D

    this.accountForm.controls["mobileNo"].enable();
    this.accountForm.controls["email"].enable();
    this.accountForm.controls["t24AccountNum"].enable();

    let body = {
      accountId: this.accountId,
      firstName: this.personalForm.value.firstName,
      secondName: this.personalForm.value.secondName,
      lastName: this.personalForm.value.lastName,
      motherName: this.personalForm.value.motherName,
      mobileNo: this.accountForm.value.mobileNo,
      email: this.accountForm.value.email,
      gender: this.personalForm.value.gender,
      identityNo: this.personalForm.value.idNumber,
      attachmentOne: this.accountForm.value.attachmentOne
        ? this.accountForm.value.attachmentOne
        : null,
      attachmentTwo: this.accountForm.value.attachmentTwo
        ? this.accountForm.value.attachmentTwo
        : null,
      attachmentThree: this.accountForm.value.attachmentThree
        ? this.accountForm.value.attachmentThree
        : null,
      birthDate: birthDate,
      identityIssueDate: identityIssueDate,
      identityExpiryDate: identityExpiryDate,
      identityTypeId: this.personalForm.value.idType.identityTypeId,
      t24AccountNum: this.accountForm.value.t24AccountNum,
      cityId: this.addressForm.value.cityId,
      subCityId: this.addressForm.value.subcityId,
      regionId: this.addressForm.value.regionId,
      cityOther: this.addressForm.value.cityOther,
      subCityOther: this.addressForm.value.subCityOther,
      regionOther: this.addressForm.value.regionOther,
      woreda: this.addressForm.value.woreda,
      houseNo: this.addressForm.value.houseNo,
    };
    
    this.httpClientService.httpClientMainRouter("WRMAL_398",`customerId=${this.accountId}`,"POST",body)
      .subscribe(
        response => {
          response = this._sharedService.decrypt(response)
          this.updateCustomerPopup(response)
          this.loading = false;
        }, 
        (err)=>{
          this.loading = false;
        });
    
    
  
    // }
  }

  async updateCustomerPopup(response){
    this.createdWallet = response;
      Swal({
        title: await this.findAllLanguagesService.getTranslate(
          "changes-saved-successfully"
        ),
        type: "success",
        showCancelButton: false,
        showCloseButton: true,
      });
      this.personalForm.reset();
      this.addressForm.reset();
      this.accountForm.reset();

      this.myStepper.reset();
      this.fileName1 = "";
      this.fileName2 = "";
      this.fileName3 = "";
      this.router.navigate(["/customer/customer-list"]);
  }
  deleteFile(controlName, fileName) {
    this.accountForm.get(controlName).setValue(null);
    if (fileName == "fileName1") {
      this.fileName1 = "";
    } else if (fileName == "fileName2") {
      this.fileName2 = "";
    } else if (fileName == "fileName3") {
      this.fileName3 = "";
    }
  }

  onFileSelect(event, controlName, fileName) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log("file", file);
    this.uploadAttachment(controlName, fileName, file);
  }
  async uploadAttachment(controlName, fileName, file) {
    this.loading = true;
    if (file == undefined || file == null) {
      this.loading = false;
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    this.httpClient
      .post<any>(`${environment.secureUrl}/uploadFile`, formData)
      .subscribe(
        (data) => {
          console.log("data>>>>>>>>>>", data);
          this.loading = false;
          if (fileName == "fileName1") {
            this.fileName1 = data.body;
          } else if (fileName == "fileName2") {
            this.fileName2 = data.body;
          } else if (fileName == "fileName3") {
            this.fileName3 = data.body;
          }

          this.accountForm.get(controlName).setValue(data.body);
        },
        async (error) => {
          console.log("im the error msg");

          this.loading = false;
          if (error.status == 401) {
            this.authService.logoutUser();
          } else if (error.status == 500) {
            this.loading = false;

            this.toaster.showError(
              await this.findAllLanguagesService.getTranslate("tech_issue")
            );
          } else {
            let response: any = error.error;
            let errorMsg = response.msgWithLanguage;
            this.toaster.showError(errorMsg);
          }
        }
      );
  }
}

@Component({
  selector: "dialog-content-example-dialog",
  templateUrl: "dialog-content-example-dialog.html",
  styleUrls: ["./dialog.component.scss"],
})
export class DialogContentDialog2 {
  today = Date.now();
  layoutDir;
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialog2>,
    private cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    console.log("dataaaaaa", data);

    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    // will log the entire data object
    console.log("from DialogContentDialog2", this.data);
  }
}
