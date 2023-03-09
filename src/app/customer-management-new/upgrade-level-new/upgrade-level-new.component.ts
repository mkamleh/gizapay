import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MatStepper,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
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
import { HttpClient } from "@angular/common/http";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-upgrade-level-new",
  templateUrl: "./upgrade-level-new.component.html",
  styleUrls: ["./upgrade-level-new.component.scss"],
})
export class UpgradeLevelNewComponent implements OnInit {
  public loading = false;

  pageTitle: string = "upgrade-customer";
  @ViewChild("stepper",{static: false}) private myStepper: MatStepper;
  public searchForm: FormGroup;
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

  isLevel1: boolean = false;
  isLevel2: boolean = false;

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

  showUpgrade: boolean = false;
  reachMaxLevel: boolean = false;
  walletLevelId: any;
  showFileValidation: boolean = false;
  mobileNumForSub: any;
  mobileRetrive: any;

  constructor(
    public findAllLanguagesService: FindAllLanguagesService,
    private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private httpService: HttpService,
    private _sharedService: SharedService,
    private ngProgress: NgProgress,
    private toaster: toasterService,
    public datepipe: DatePipe,
    private authService: AuthServiceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
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
        // this.getAccount();
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
          Validators.pattern("[^,!@#$%^&*()_+?/<>]+$"),
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
      attachmentOne: ["", Validators.compose([Validators.required])],
      attachmentTwo: [""],
      attachmentThree: [""],
      t24AccountNum: [""],
    });
    this.searchForm = this.fb.group({
      mobileNo: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
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

  async getIdentityTypes() {
    
    this.httpClientService.httpClientMainRouter("WRMAL_095","null","GET").subscribe( res=>{
      let response = this._sharedService.decrypt(res)
      let identitiesObj: any = response;
      this.idTypes = identitiesObj.body;
    },err =>{
      this.loading = false;
    })
  }

  getRegions() {
    this.httpClientService.httpClientMainRouter("WRMAL_172","null","GET").subscribe( res=>{
      let response = this._sharedService.decrypt(res)
      this.regions = response.body;
    },err =>{
    })
  }
  getCities(regionId) {
    this.httpClientService.httpClientMainRouter("WRMAL_173",`regionId=${regionId}`,"GET").subscribe( res=>{
      let response = this._sharedService.decrypt(res)
      this.cities = response.body;
    },err =>{
    })
  }

  getSubcity(cityId) {
    this.httpClientService.httpClientMainRouter("WRMAL_171",`cityId=${cityId}`,"GET").subscribe( res=>{
      let response = this._sharedService.decrypt(res)
      this.subcities = response.body;
    },err =>{
    })
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
        // this.form.get("regionOther").setValidators(null);
        this.addressForm.get("regionOther").clearValidators();
        this.addressForm.get("regionOther").updateValueAndValidity();
      }
    }
  }
  cityChange(event) {
    console.log("event", event);

    if (event) {
      this.getSubcity(event);
      console.log("1111", this.showOtherCity);

      if (this.addressForm.controls["cityId"].value == 162) {
        console.log("2222", this.showOtherCity);

        this.addressForm.get("cityOther").setValidators([Validators.required]);
        this.addressForm.get("cityOther").updateValueAndValidity();
        this.showOtherCity = true;
        console.log("showOtherCity", this.showOtherCity);
      } else {
        this.showOtherCity = false;
        // this.form.get("cityOther").setValidators(null);
        this.addressForm.get("cityOther").clearValidators();
        this.addressForm.get("cityOther").updateValueAndValidity();
      }
    }
  }
  subCityChange(event?) {
    console.log("event", event);

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
  async completeStep3() {
    this.accountForm.controls["mobileNo"].enable();
    (<any>Object).values(this.accountForm.controls).forEach((control) => {
      control.markAsTouched();
    });
    this.isSubmitForm = true;
    if (!this.accountForm.get("attachmentOne").valid) {
      this.showFileValidation = true;
    }
    if (this.accountForm.valid) {
      this.loading = true;
      let birthDate =
        this.formatDate(new Date(this.personalForm.value.birthDate)) +
        "T00:00:00";
      let identityIssueDate =
        this.formatDate(new Date(this.personalForm.value.identityIssueDate)) +
        "T00:00:00";
      let identityExpiryDate =
        this.formatDate(new Date(this.personalForm.value.identityExpiryDate)) +
        "T00:00:00";

      let body = {
        firstName: this.personalForm.value.firstName,
        secondName: this.personalForm.value.secondName,
        lastName: this.personalForm.value.lastName,
        motherName: this.personalForm.value.motherName,
        mobileNo: this.accountForm.value.mobileNo,
        email: this.accountForm.value.email,
        gender: this.personalForm.value.gender,
        identityNo: this.personalForm.value.idNumber,
        attachmentOne: this.accountForm.value.attachmentOne,
        attachmentTwo: this.accountForm.value.attachmentTwo,
        attachmentThree: this.accountForm.value.attachmentThree,
        birthDate: this.parseDate(this.accountInfo.birthDate),
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
        houseNo: "",
        // walletLevel: this.walletLevelId,
      };
      this.httpClientService.httpClientMainRouter("WRMAL_049",this.addressForm.value.cityId,"PUT",body).subscribe( res=>{
        this.loading = false;
        let response = this._sharedService.decrypt(res)
        this.onSuccessfulUpgrade(response)
      },err =>{
        this.loading = false;
      })
    }
  }

  async onSuccessfulUpgrade (response){
    this.isSubmitForm = false;
    this.createdWallet = response;
    let nextWalletLevel = this.createdWallet.body.walletLevel;
    Swal({
      title: await this.findAllLanguagesService.getTranslate(
        "customer-upgraded"
      ),
      text:
        (await this.findAllLanguagesService.getTranslate(
          "Successfully upgraded to level"
        )) +
        " " +
        nextWalletLevel,
      type: "success",
      showCancelButton: false,
      showCloseButton: true,
    });
    this.personalForm.reset();
    this.addressForm.reset();
    this.accountForm.reset();
    this.searchForm.reset();
    this.myStepper.reset();
    this.fileName1 = "";
    this.fileName2 = "";
    this.fileName3 = "";
    this.showUpgrade = false;
  }

  async handleMobileNo(mobileNumber: string) {
    if (mobileNumber.startsWith("+251")) {
      return (this.mobileNumForSub = mobileNumber.substring(4));
    } else {
      return (this.mobileNumForSub = mobileNumber);
    }
  }
  /////////// if id null ill send the other
  async inquire() {
    if (this.searchForm.valid) {
      let request_options: any = {
        method: "GET",
        path: "",
      };
      let walletToSearch = this.searchForm.controls["mobileNo"].value;
      this.httpClientService.httpClientMainRouter("WRMAL_048",`mobileNo=251${walletToSearch}`,"GET").subscribe( res=>{
        let response = this._sharedService.decrypt(res)
        this.updateForm(response)
      },err =>{
        this.loading = false;
      })
    }
  }

  async updateForm(response){
    this.accountInfo = response.body;
    console.log("this.accountInfo", this.accountInfo);
    this.mobileNumForSub = response.body.mobileNumber;
    console.log(this.mobileNumForSub, "this.mobileRetriveBefore");

    this.handleMobileNo(this.mobileNumForSub);
    console.log(this.mobileNumForSub, "this.mobileRetrive");

    if (this.accountInfo.walletLevelId >= 4 && !null) {
      this.reachMaxLevel = true;
      Swal({
        title: await this.findAllLanguagesService.getTranslate(
          "Wallet cannot be upgraded"
        ),
        text: await this.findAllLanguagesService.getTranslate(
          "This wallet is upgraded to the max level."
        ),
        type: "info",
        showCancelButton: false,
        showCloseButton: true,
      });
    } else {
      this.showUpgrade = true;
      this.walletLevelId = this.accountInfo.walletLevelId;
      console.log("kkkkkkkkk", this.accountInfo);
      console.log(this.walletLevelId, "walletLevelIdBefore");

      this.walletLevelId = parseInt(this.walletLevelId) - 1;
      console.log(this.walletLevelId, "walletLevelIdAfter");

      if (this.walletLevelId == "1") {
        this.isLevel1 = false;
        this.isLevel2 = false;
        this.accountForm
          .get("attachmentOne")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentOne").updateValueAndValidity();

        this.accountForm.get("attachmentTwo").setValue(null);
        this.accountForm.get("attachmentTwo").setErrors(null);
        this.accountForm.get("attachmentTwo").clearValidators();
        this.accountForm.get("attachmentTwo").updateValueAndValidity();

        this.accountForm.get("attachmentThree").setValue(null);
        this.accountForm.get("attachmentThree").setErrors(null);
        this.accountForm.get("attachmentThree").clearValidators();
        this.accountForm.get("attachmentThree").updateValueAndValidity();
      } else if (this.walletLevelId == "2") {
        this.isLevel1 = true;
        this.isLevel2 = false;

        this.accountForm
          .get("attachmentOne")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentOne").updateValueAndValidity();
        this.accountForm
          .get("attachmentTwo")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentTwo").updateValueAndValidity();

        this.accountForm.get("attachmentThree").setValue(null);
        this.accountForm.get("attachmentThree").setErrors(null);
        this.accountForm.get("attachmentThree").clearValidators();
        this.accountForm.get("attachmentThree").updateValueAndValidity();
      } else if (this.walletLevelId == "3") {
        this.isLevel1 = true;
        this.isLevel2 = true;
        this.accountForm
          .get("attachmentOne")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentOne").updateValueAndValidity();
        this.accountForm
          .get("attachmentTwo")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentTwo").updateValueAndValidity();
        this.accountForm
          .get("attachmentThree")
          .setValidators(Validators.required);
        this.accountForm.get("attachmentThree").updateValueAndValidity();
      }

      if (this.accountForm.controls["t24AccountNum"].valid) {
        console.log("Rannossohsos");

        this.accountForm.get("attachmentOne").setValue(null);
        this.accountForm.get("attachmentOne").setErrors(null);
        this.accountForm.get("attachmentOne").clearValidators();

        this.accountForm.get("attachmentTwo").setValue(null);
        this.accountForm.get("attachmentTwo").setErrors(null);
        this.accountForm.get("attachmentTwo").clearValidators();

        this.accountForm.get("attachmentThree").setValue(null);
        this.accountForm.get("attachmentThree").setErrors(null);
        this.accountForm.get("attachmentThree").clearValidators();
      }

      this.personalForm
        .get("firstName")
        .setValue(this.accountInfo.firstName);
      this.personalForm
        .get("secondName")
        .setValue(this.accountInfo.secondName);
      this.personalForm.get("lastName").setValue(this.accountInfo.lastName);
      this.personalForm
        .get("motherName")
        .setValue(
          this.accountInfo.motherName ? this.accountInfo.motherName : ""
        );

      this.personalForm
        .get("birthDate")
        .setValue(this.parseDate(this.accountInfo.birthDate));

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

      this.personalForm.get("gender").setValue(this.accountInfo.gender);
      this.personalForm
        .get("idNumber")
        .setValue(
          this.accountInfo.identityNo ? this.accountInfo.identityNo : ""
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
      this.accountForm.get("mobileNo").setValue(this.mobileNumForSub);
      this.accountForm.controls["mobileNo"].disable();

      this.accountForm
        .get("attachmentOne")
        .setValue(this.accountInfo.attachmentOne);
      this.fileName1 = this.accountInfo.attachmentOne;
      this.fileName2 = this.accountInfo.attachmentTwo;
      this.fileName3 = this.accountInfo.attachmentThree;

      this.accountForm
        .get("attachmentTwo")
        .setValue(this.accountInfo.attachmentTwo);
      this.accountForm
        .get("attachmentThree")
        .setValue(this.accountInfo.attachmentThree);
      this.accountForm
        .get("t24AccountNum")
        .setValue(this.accountInfo.t24AccountNum);

      this.addressForm.get("woreda").setValue(this.accountInfo.woreda);
      this.addressForm.get("houseNo").setValue(this.accountInfo.houseNo);

      this.getCities(this.accountInfo.regionId);
      this.getSubcity(this.accountInfo.cityId);

      this.addressForm.get("regionId").setValue(this.accountInfo.regionId);
      this.addressForm.get("cityId").setValue(this.accountInfo.cityId);
      this.addressForm
        .get("subcityId")
        .setValue(this.accountInfo.subCityId);

      // other
      if (this.accountInfo.regionId == 2) {
        this.regionChange(this.accountInfo.regionId);
        //  this.loadType(response.body.region.id);
        this.addressForm
          .get("regionOther")
          .setValue(response.body.regionOther);
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
      if (this.accountInfo.identityIssueDate) {
        this.personalForm
          .get("identityIssueDate")
          .setValue(this.parseDate(this.accountInfo.identityIssueDate));
      }
      if (this.accountInfo.identityExpiryDate) {
        this.personalForm
          .get("identityExpiryDate")
          .setValue(this.parseDate(this.accountInfo.identityExpiryDate));
      }
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

  formatDate(date) {
    var monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    if (day <= 9) {
      return year + "-" + monthNames[monthIndex] + "-" + "0" + day;
    } else {
      return year + "-" + monthNames[monthIndex] + "-" + day;
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
          this.loading = false;
          if (error.status == 401) {
            this.authService.logoutUser();
          }
          if (error.status == 500) {
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
