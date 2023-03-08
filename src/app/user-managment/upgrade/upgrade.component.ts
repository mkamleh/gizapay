/** @format */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as $ from "jquery";
import { HttpService } from "app/_services/HttpService";
import { FileUploader } from "ng2-file-upload/ng2-file-upload";
import { environment } from "environments/environment";
import { DialogContentDialog2 } from "../create-wallet/create-wallet.component";
import { saveAs } from "file-saver";
import { SharedService } from "app/_services/shared-service";
import { ActivatedRoute, Router } from "@angular/router";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/shared/format-datepicker";
import Swal from "sweetalert2";
import { Encryption } from "app/_services/Encryption";

@Component({
  selector: "app-upgrade",
  templateUrl: "./upgrade.component.html",
  styleUrls: ["./upgrade.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class UpgradeComponent implements OnInit {
  upgradeWalletForm: FormGroup;
  layoutDir: any;
  title = "Upload a File";
  public uploader: FileUploader = new FileUploader({
    itemAlias: "photo",
  });
  countries: any;
  error: any;
  idTypes: any;
  wallet: any;
  showInfo: boolean = false;
  minDate = new Date();
  minBirthDate = new Date(
    this.minDate.setFullYear(this.minDate.getFullYear() - 18)
  );
  today = new Date();
  fileName1: string = "";
  fileName2: string = "";
  fileName3: string = "";
  idType: any;
  showCountry: boolean = false;
  regions = [];
  cities = [];
  subCities = [];
  showOtherRegion: boolean;
  showOtherCity: boolean;
  showOtherSubCity: boolean;
  reachMaxLevel: boolean = false;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  pageTitle: string = "level_upgrade";
  sub: any;
  accountMobileNo: any;
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
    private httpService: HttpService,
    public datepipe: DatePipe,
    public _sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
    this.loadForm();
    this.getIdentityTypes();
    this.getCountries();
    this.setT24Validators();
    this.regionsCall();
    this.sub = this.route.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.accountMobileNo = +params["mobileNo"] || "";
      this.upgradeWalletForm.get("walletCode").setValue(this.accountMobileNo);

      console.log("accountMobileNo", this.accountMobileNo);
      console.log(
        "this.upgradeWalletForm.get('walletCode')",
        this.upgradeWalletForm.get("walletCode")
      );
      if (this.accountMobileNo) {
        this.getWalletInfo();
      }
    });
  }

  loadForm() {
    this.upgradeWalletForm = this.fb.group({
      walletCode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(13),
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
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
      idCountry: [""],
      identityIssueDate: ["", Validators.compose([Validators.required])],
      attachmentOne: ["", Validators.compose([Validators.required])],
      idType: ["", Validators.compose([Validators.required])],
      region: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      subCity: ["", Validators.compose([Validators.required])],
      regionOther: [""],
      cityOther: [""],
      subCityOther: [""],
      woreda: ["", Validators.compose([Validators.required])],
      houseNo: ["", Validators.compose([Validators.required])],
      identityExpiryDate: ["", Validators.compose([Validators.required])],
      attachmentTwo: [""],
      t24AccountNum: [""],
      // t24AccountNum: [""],
      walletLevel: [""],
      attachmentThree: [""],
    });
  }
  nextStep() {
    $(document).ready(function () {
      $("#profile").addClass("active");
      $("#home").removeClass("active");
    });
  }
  nextStep1() {
    if (this.upgradeWalletForm.controls["walletCode"].value) {
      this.upgradeWalletForm.controls["subCityOther"].setValue(
        this.wallet.subCityOther ? this.wallet.subCityOther : ""
      );
      // this.getWalletInfo();
    }
    $(document).ready(function () {
      $("#profile1").addClass("active");
      $("#profile").removeClass("active");
    });
  }
  nextStep2() {
    $(document).ready(function () {
      $("#profile2").addClass("active");
      $("#profile1").removeClass("active");
    });
  }
  backStep() {
    $(document).ready(function () {
      $("#home").addClass("active");
      $("#profile").removeClass("active");
    });
  }
  backStep1() {
    $(document).ready(function () {
      $("#profile").addClass("active");
      $("#profile1").removeClass("active");
    });
  }
  backStep2() {
    $(document).ready(function () {
      $("#profile1").addClass("active");
      $("#profile2").removeClass("active");
    });
  }
  private markFormGroupTouched(controls) {
    // (<any>Object).values(controls).forEach((control) => {
    //   control.markAsTouched();
    // });

    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
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

    let year = date.year;

    return year + "-" + monthValue + "-" + dayOfMonth;
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
        this.upgradeWalletForm.get(controlName).setValue(reader.result);
      };
      console.log(this.upgradeWalletForm.controls);
    };
  }
  getIdentityTypes() {
    let token = this.cookieService.get("agt_token");
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: lng.code,
      "x-auth-token": token,
      SERVICE_WRAPPER: "WRMAL_095",
    });

    this.ngProgress.start();
    return this.http
      .get<string>(`${environment.secureUrl}`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        async (response) => {
          let identitiesObj: any = this.encryption.decrypt(response);
          this.idTypes = identitiesObj.body;
          console.log("identitiesObj", identitiesObj);
          this.ngProgress.done();
          this.error = "";
        },
        async (error) => {
          try {
            let response: any = this.encryption.decrypt(error.error)!;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          } catch {
            let response2: any = error;

            this.error = response2.msgWithLanguage;
            if (response2.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );

              this.toaster.showError(this.error);
            }
            if (response2.status === 401) {
              this.toaster.showError("Session Time out");
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        }
      );
  }
  getCountries() {
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      lng: lng.code,
      SERVICE_WRAPPER: "WRMAL_086",
    });

    this.ngProgress.start();
    return this.http
      .get<string>(`${environment.secureUrl}`, {
        headers,
        responseType: "text" as "json",
      })
      .subscribe(
        async (response) => {
          let countriesObj: any = this.encryption.decrypt(response);
          this.countries = countriesObj.body;
          console.log("countriesObj", countriesObj);

          this.ngProgress.done();
          this.error = "";
        },
        async (error) => {
          try {
            let response: any = this.encryption.decrypt(error.error)!;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          } catch {
            let response2: any = error;

            this.error = response2.msgWithLanguage;
            if (response2.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );

              this.toaster.showError(this.error);
            }
            if (response2.status === 401) {
              this.toaster.showError("Session Time out");
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        }
      );
  }
  getWalletInfo() {
    this.ngProgress.start();
    if (this.upgradeWalletForm.controls["walletCode"].value) {
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      let walletToSearch = this.upgradeWalletForm.controls["walletCode"].value;
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_048",
        SERVICE_PARAM: `mobileNo=${walletToSearch}`,
      });

      return this.http
        .get<string>(`${environment.secureUrl}`, {
          headers,
          responseType: "text" as "json",
        })
        .subscribe(
          async (response) => {
            let searchedObj: any = this.encryption.decrypt(response);
            this.wallet = searchedObj.body;

            if (searchedObj.body.walletLevel == "3") {
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
              if (this.wallet) {
                this.upgradeWalletForm.controls["firstName"].setValue(
                  this.wallet.firstName ? this.wallet.firstName : ""
                );
                this.upgradeWalletForm.controls["secondName"].setValue(
                  this.wallet.secondName ? this.wallet.secondName : ""
                );

                this.upgradeWalletForm.controls["lastName"].setValue(
                  this.wallet.lastName ? this.wallet.lastName : ""
                );
                this.upgradeWalletForm.controls["motherName"].setValue(
                  this.wallet.motherName ? this.wallet.motherName : ""
                );
                this.upgradeWalletForm.controls["email"].setValue(
                  this.wallet.email ? this.wallet.email : ""
                );
                let mobileNum = this.wallet.mobileNo
                  ? this.wallet.mobileNo.slice(1)
                  : "";
                this.upgradeWalletForm.controls["mobileNo"].setValue(mobileNum);
                this.upgradeWalletForm.controls["birthDate"].setValue(
                  this.wallet.birthDate ? this.wallet.birthDate : ""
                );
                this.upgradeWalletForm.controls["gender"].setValue(
                  this.wallet.gender ? this.wallet.gender : ""
                );
                this.upgradeWalletForm.controls["idNumber"].setValue(
                  this.wallet.identityNo ? this.wallet.identityNo : ""
                );
                this.upgradeWalletForm.controls["idCountry"].setValue(
                  this.wallet.idCountry ? this.wallet.idCountry : ""
                );
                this.upgradeWalletForm.controls["identityIssueDate"].setValue(
                  this.wallet.identityIssueDate
                    ? this.wallet.identityIssueDate
                    : ""
                );
                this.upgradeWalletForm.controls["attachmentOne"].setValue(
                  this.wallet.attachmentOne ? this.wallet.attachmentOne : ""
                );
                this.fileName1 = this.wallet.attachmentOne
                  ? this.wallet.attachmentOne
                  : "";
                this.upgradeWalletForm.controls["attachmentTwo"].setValue(
                  this.wallet.attachmentTwo ? this.wallet.attachmentTwo : ""
                );
                this.fileName2 = this.wallet.attachmentTwo
                  ? this.wallet.attachmentTwo
                  : "";
                this.upgradeWalletForm.controls["attachmentThree"].setValue(
                  this.wallet.attachmentThree ? this.wallet.attachmentThree : ""
                );
                this.fileName3 = this.wallet.attachmentThree
                  ? this.wallet.attachmentThree
                  : "";
                this.upgradeWalletForm.controls["motherName"].setValue(
                  this.wallet.motherName ? this.wallet.motherName : ""
                );

                if (this.regions) {
                  let region = this.regions.find(
                    (e) => e.regionId == this.wallet.regionId
                  );
                  this.upgradeWalletForm.controls["region"].setValue(
                    this.wallet.regionId ? region : ""
                  );
                  console.log("REGIONNNNN", region);

                  await this.cityCall(region);
                  this.upgradeWalletForm.controls["regionOther"].setValue(
                    this.wallet.regionOther ? this.wallet.regionOther : ""
                  );
                  let city = this.cities.find(
                    (e) => e.cityId == this.wallet.cityId
                  );
                  console.log("CITYYYY111111", city);
                }
                if (this.cities) {
                  let city = this.cities.find(
                    (e) => e.cityId == this.wallet.cityId
                  );
                  console.log("CITYYYY2222222", city);
                  this.upgradeWalletForm.controls["city"].setValue(
                    this.wallet.cityId ? city : ""
                  );

                  await this.subCityCall(city);
                  this.upgradeWalletForm.controls["cityOther"].setValue(
                    this.wallet.cityOther ? this.wallet.cityOther : ""
                  );
                }
                if (this.subCities) {
                  let subCity = this.subCities.find(
                    (e) => e.subCityId == this.wallet.subCityId
                  );
                  this.upgradeWalletForm.controls["subCity"].setValue(
                    this.wallet.subCityId ? subCity : ""
                  );

                  this.upgradeWalletForm.controls["subCityOther"].setValue(
                    this.wallet.subCityOther ? this.wallet.subCityOther : ""
                  );
                }

                this.upgradeWalletForm.controls["woreda"].setValue(
                  this.wallet.woreda ? this.wallet.woreda : ""
                );
                this.upgradeWalletForm.controls["houseNo"].setValue(
                  this.wallet.houseNo ? this.wallet.houseNo : ""
                );
                this.upgradeWalletForm.controls["t24AccountNum"].setValue(
                  this.wallet.t24AccountNum ? this.wallet.t24AccountNum : ""
                );
                if (this.countries) {
                  let country = this.countries.find(
                    (e) => e.countryId == this.wallet.countryId
                  );
                  this.upgradeWalletForm.controls["idCountry"].setValue(
                    this.wallet.countryId ? country : ""
                  );
                }
                if (this.idTypes) {
                  let idType = this.idTypes.find(
                    (e) => e.identityTypeId == this.wallet.identityTypeId
                  );
                  this.upgradeWalletForm.controls["idType"].setValue(
                    this.wallet.identityTypeId ? idType : ""
                  );
                  this.idType = idType;
                }
                let bDate = this.wallet.birthDate
                  ? this.parseDate(this.wallet.birthDate)
                  : "";
                this.upgradeWalletForm.controls["birthDate"].setValue(bDate);
                let issueDate = this.wallet.identityIssueDate
                  ? this.parseDate(this.wallet.identityIssueDate)
                  : "";
                this.upgradeWalletForm.controls["identityIssueDate"].setValue(
                  issueDate
                );
                let exDate = this.wallet.identityExpiryDate
                  ? this.parseDate(this.wallet.identityExpiryDate)
                  : "";
                this.upgradeWalletForm.controls["identityExpiryDate"].setValue(
                  exDate
                );
                this.upgradeWalletForm.controls["walletLevel"].setValue(
                  this.wallet.walletLevel ? this.wallet.walletLevel : 0
                );
              }
              this.setT24Validators();
              console.log("this.wallet", this.wallet);
              console.log(
                "this.upgradeWalletForm.controls",
                this.upgradeWalletForm.controls
              );
              console.log(
                "this.upgradeWalletForm.value",
                this.upgradeWalletForm.value
              );

              this.showInfo = true;
            }
            this.ngProgress.done();
            this.error = "";
          },
          async (error) => {
            try {
              let response: any = this.encryption.decrypt(error.error)!;

              this.error = response.msgWithLanguage;
              if (response.status === 500) {
                this.error = await this.findAllLanguagesService.getTranslate(
                  "tech_issue"
                );
              }
              this.toaster.showError(this.error);
              if (response.status === 401) {
                this.authService.logoutUser();
              }
              this.ngProgress.done();
            } catch {
              let response2: any = error;

              this.error = response2.msgWithLanguage;
              if (response2.status === 500) {
                this.error = await this.findAllLanguagesService.getTranslate(
                  "tech_issue"
                );

                this.toaster.showError(this.error);
              }
              if (response2.status === 401) {
                this.toaster.showError("Session Time out");
                this.authService.logoutUser();
              }
              this.ngProgress.done();
            }
          }
        );
    }
  }
  openDialog(body) {
    // const dialogRef = this.dialog.open(DialogContentDialog2);
    const dialogRef = this.dialog.open(DialogContentDialog2, {
      data: body,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  async upgrade() {
    this.markFormGroupTouched(this.upgradeWalletForm.controls);
    this.ngProgress.start();
    console.log("form controls", this.upgradeWalletForm.controls);
    console.log("(this.upgradeWalletForm.valid)", this.upgradeWalletForm.valid);
    if (!this.upgradeWalletForm.controls["walletCode"].value) {
      this.upgradeWalletForm.get("walletCode").setValue(this.wallet.walletCode);
    }
    if (this.upgradeWalletForm.valid) {
      let birthDate = this.datepipe.transform(
        this.upgradeWalletForm.value.birthDate,
        "yyyy-MM-dd"
      );
      let identityIssueDate = this.datepipe.transform(
        this.upgradeWalletForm.value.identityIssueDate,
        "yyyy-MM-dd"
      );
      let identityExpiryDate = this.datepipe.transform(
        this.upgradeWalletForm.value.identityExpiryDate,
        "yyyy-MM-dd"
      );
      let body = {
        firstName: this.upgradeWalletForm.value.firstName,
        secondName: this.upgradeWalletForm.value.secondName,
        lastName: this.upgradeWalletForm.value.lastName,
        motherName: this.upgradeWalletForm.value.motherName,
        mobileNo: this.upgradeWalletForm.value.mobileNo,
        email: this.upgradeWalletForm.value.email,
        countryId: this.upgradeWalletForm.value.idCountry.countryId,
        gender: this.upgradeWalletForm.value.gender,
        identityNo: this.upgradeWalletForm.value.idNumber,
        attachmentOne: this.upgradeWalletForm.value.attachmentOne,
        attachmentTwo: this.upgradeWalletForm.value.attachmentTwo
          ? this.upgradeWalletForm.value.attachmentTwo
          : null,
        attachmentThree: this.upgradeWalletForm.value.attachmentThree
          ? this.upgradeWalletForm.value.attachmentThree
          : null,
        birthDate: birthDate,
        identityIssueDate: identityIssueDate,
        identityExpiryDate: identityExpiryDate,
        identityTypeId: this.upgradeWalletForm.value.idType.identityTypeId,
        t24AccountNum: this.upgradeWalletForm.value.t24AccountNum,
        walletLevel: this.wallet.walletLevel,
        region: this.upgradeWalletForm.value.region.regionId,
        regionOther: this.upgradeWalletForm.value.regionOther,
        city: this.upgradeWalletForm.value.city.cityId,
        cityOther: this.upgradeWalletForm.value.cityOther,
        subCity: this.upgradeWalletForm.value.subCity.subCityId,
        subCityOther: this.upgradeWalletForm.value.subCityOther,
        woreda: this.upgradeWalletForm.value.woreda,
        houseNo: this.upgradeWalletForm.value.houseNo,
      };
      console.log("body", body);

      let request_options: any = {
        method: "PUT",
        path: "",
        body: body,
      };
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_049");

      let response = await this.httpService.http_request(request_options);
      console.log("register", response.body);
      if (response.status == 200) {
        let doneMessage = await this.findAllLanguagesService.getTranslate(
          "operation_done"
        );
        this.toaster.showSuccess(doneMessage);
        setTimeout(() => this.openDialog(response.body), 2500);

        this.upgradeWalletForm.reset();
        this.showInfo = false;
        this.ngProgress.done();
      } else if (response.status == 401) {
        this.authService.logoutUser();
        this.ngProgress.done();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);
        this.ngProgress.done();
        this.errorMsg = tecErr;
      } else {
        this.ngProgress.done();
        this.toaster.showError(response.msgWithLanguage);
      }
    } else {
      Swal({
        title: "Error",
        text: await this.findAllLanguagesService.getTranslate(
          "Please Make sure all fields are valid!"
        ),
        type: "error",
        showCancelButton: false,
        showCloseButton: true,
      });
    }
  }

  idTypeChange(event) {
    if (this.upgradeWalletForm.controls["idType"].value) {
      console.log("eveeeeent", event);
      if (this.upgradeWalletForm.controls["idType"].value.identityTypeId != 3) {
        this.upgradeWalletForm.controls["idCountry"].setValue("");
        this.showCountry = false;
      } else {
        // this.idType = event;
        console.log("id type afer change", this.idType);
        this.showCountry = true;
        // this.upgradeWalletForm.controls["idType"].setValue(event);
      }
    }
  }

  async regionsCall() {
    this.ngProgress.start();
    this.request_options.path = "";
    this.request_options.method = "GET";
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_172");
    let response = await this.httpService.http_request(this.request_options);

    if (response.status == 200) {
      this.regions = response.body;
      this.ngProgress.done();
    }
    console.log("regions", this.regions);
  }
  async cityCall(region) {
    this.ngProgress.start();
    console.log("citycall", region);
    if (region) {
      this.request_options.path = "";
      this.request_options.method = "GET";
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_173");
      this.httpService.setHeader(
        "SERVICE_PARAM",
        `regionId=${region.regionId}`
      );
      let response = await this.httpService.http_request(this.request_options);

      if (response.status == 200) {
        this.cities = response.body;
        this.ngProgress.done();
      } else if (response.status == 401) {
        this.authService.logoutUser();
        this.ngProgress.done();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);
        this.ngProgress.done();
        this.errorMsg = tecErr;
      }
    }
    console.log("cities", this.cities);
  }
  async subCityCall(city) {
    console.log("subCityCall", city);

    if (city) {
      this.request_options.path = "";
      this.request_options.method = "GET";
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_171");
      this.httpService.setHeader("SERVICE_PARAM", `cityId=${city.cityId}`);

      let response = await this.httpService.http_request(this.request_options);

      if (response.status == 200) {
        this.subCities = response.body;
        this.ngProgress.done();
      } else if (response.status == 401) {
        this.authService.logoutUser();
        this.ngProgress.done();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);
        this.ngProgress.done();
        this.errorMsg = tecErr;
      }
    }
    console.log("subCities", this.subCities);
  }

  regionChange(event) {
    if (event) {
      // this.cityCall(event.regionId);
      if (this.upgradeWalletForm.controls["region"].value.caption == "Other") {
        this.upgradeWalletForm
          .get("regionOther")
          .setValidators([Validators.required]);
        this.upgradeWalletForm.get("regionOther").updateValueAndValidity();

        this.showOtherRegion = true;
      } else {
        this.showOtherRegion = false;
        // this.upgradeWalletForm.get("regionOther").setValidators(null);
        this.upgradeWalletForm.get("regionOther").clearValidators();
        this.upgradeWalletForm.get("regionOther").updateValueAndValidity();
      }
    }
  }
  cityChange(event) {
    if (event) {
      // this.subCityCall(event.cityId);

      if (this.upgradeWalletForm.controls["city"].value.caption == "Other") {
        this.upgradeWalletForm
          .get("cityOther")
          .setValidators([Validators.required]);
        this.upgradeWalletForm.get("cityOther").updateValueAndValidity();
        this.showOtherCity = true;
      } else {
        this.showOtherCity = false;
        // this.upgradeWalletForm.get("cityOther").setValidators(null);
        this.upgradeWalletForm.get("cityOther").clearValidators();
        this.upgradeWalletForm.get("cityOther").updateValueAndValidity();
      }
    }
  }
  subCityChange() {
    if (this.upgradeWalletForm.controls["subCity"].value) {
      if (this.upgradeWalletForm.controls["subCity"].value.caption == "Other") {
        this.upgradeWalletForm
          .get("subCityOther")
          .setValidators([Validators.required]);
        this.upgradeWalletForm.get("subCityOther").updateValueAndValidity();

        this.showOtherSubCity = true;
      } else {
        this.showOtherSubCity = false;
        // this.upgradeWalletForm.get("subCityOther").setValidators(null);
        this.upgradeWalletForm.get("subCityOther").clearValidators();
        this.upgradeWalletForm.get("subCityOther").updateValueAndValidity();
      }
    }
  }
  onNavigate(url) {
    // window.location.href = url;
    window.open(url, "_blank");
  }
  // export(url) {
  // return this.http.get(url, { responseType: "blob" });
  // }

  // exportPdf(url) {
  //   this.export(url).subscribe(data => saveAs(data, `pdf report.pdf`));
  // }

  setT24Validators() {
    const t24Control = this.upgradeWalletForm.get("t24AccountNum");
    const attachmentThree = this.upgradeWalletForm.get("attachmentThree");

    this.upgradeWalletForm
      .get("walletLevel")
      .valueChanges.subscribe((walletLevel) => {
        console.log("walletLevel00", walletLevel);
        if (walletLevel == 0) {
          this.upgradeWalletForm.get("t24AccountNum").setValidators(null);
          this.upgradeWalletForm.get("attachmentThree").setValidators(null);
          this.upgradeWalletForm.get("t24AccountNum").clearValidators();
          this.upgradeWalletForm.get("attachmentThree").clearValidators();
        } else if (walletLevel != 0) {
          this.upgradeWalletForm
            .get("t24AccountNum")
            .setValidators([
              Validators.minLength(5),
              Validators.maxLength(15),
              Validators.pattern("^[0-9]*$"),
            ]);
          this.upgradeWalletForm
            .get("attachmentThree")
            .setValidators([Validators.required]);
        }
        t24Control.updateValueAndValidity();
        attachmentThree.updateValueAndValidity();
        console.log("checking form value", this.upgradeWalletForm.value);
      });
  }
}
