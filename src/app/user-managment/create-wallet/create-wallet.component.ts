/** @format */

import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as $ from "jquery";
import { HttpService } from "app/_services/HttpService";
import { FileUploader } from "ng2-file-upload/ng2-file-upload";
import { environment } from "environments/environment";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SharedService } from "app/_services/shared-service";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from "app/shared/format-datepicker";
import Swal from "sweetalert2";
import { Encryption } from "app/_services/Encryption";

@Component({
  selector: "app-create-wallet",
  templateUrl: "./create-wallet.component.html",
  styleUrls: ["./create-wallet.component.scss"],
  providers: [
    DatePipe,
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  // encapsulation: ViewEncapsulation.None
})
export class CreateWalletComponent implements OnInit {
  createWalletForm: FormGroup;
  layoutDir: any;
  title = "Upload a File";
  public uploader: FileUploader = new FileUploader({
    itemAlias: "photo",
  });
  countries: any;
  error: any;
  idTypes: any;
  minDate = new Date();
  minBirthDate = new Date(
    this.minDate.setFullYear(this.minDate.getFullYear() - 18)
  );
  today = new Date();
  fileName1: string = "";
  fileName2: string = "";
  fileName3: string = "";
  createdWallet: any;
  regions = [];
  cities = [];
  subCities = [];
  showOtherRegion: boolean;
  showOtherCity: boolean;
  showOtherSubCity: boolean;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  pageTitle: string = "Create Customer";
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
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    console.log("Language", lng);
    this.layoutDir = lng.direction;
  }

  ngOnInit() {
   
  }
}
//   onFileUpload(controlName, fileName) {
//     this.uploader.onAfterAddingFile = (file) => {
//       if (fileName == "fileName1") {
//         this.fileName1 = file._file.name;
//       } else if (fileName == "fileName2") {
//         this.fileName2 = file._file.name;
//       } else if (fileName == "fileName3") {
//         this.fileName3 = file._file.name;
//       }
//       file.withCredentials = false;
//       let reader = new FileReader();
//       let myFile: File;
//       myFile = file._file;
//       reader.readAsDataURL(myFile);
//       reader.onload = () => {
//         this.createWalletForm.get(controlName).setValue(reader.result);
//       };
//       console.log(this.createWalletForm.controls);
//     };
//     // this.uploader.onCompleteItem = (
//     //   item: any,
//     //   response: any,
//     //   status: any,
//     //   headers: any
//     // ) => {
//     //   // let reader = new FileReader();
//     //   // let file: File;
//     //   // file = item._file;
//     //   // reader.readAsDataURL(file);
//     //   // reader.onload = () => {
//     //   //   this.createWalletForm.get("controlName").setValue(reader.result);
//     //   // };

//     //   console.log(this.createWalletForm.controls);

//     //   console.log("FileUpload:uploaded:item", item);
//     //   console.log("FileUpload:uploaded:headers", headers);

//     // };
//   }
//   loadForm() {
//     this.createWalletForm = this.fb.group({
//       firstName: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(20),
//           Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
//         ]),
//       ],
//       secondName: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(20),
//           Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
//         ]),
//       ],
//       lastName: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(20),
//           Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
//         ]),
//       ],
//       motherName: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(2),
//           Validators.maxLength(20),
//           Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
//         ]),
//       ],
//       email: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(8),
//           Validators.maxLength(254),
//         ]),
//       ],
//       mobileNo: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(9),
//           Validators.maxLength(13),
//           Validators.pattern("^[0-9]*$"),
//         ]),
//       ],
//       birthDate: ["", Validators.compose([Validators.required])],
//       gender: ["", Validators.compose([Validators.required])],
//       idNumber: [
//         "",
//         Validators.compose([
//           Validators.required,
//           Validators.minLength(4),
//           Validators.maxLength(32),
//           Validators.pattern("[^,!@#$%^&*()_+?/<>]+$"),
//         ]),
//       ],
//       idCountry: [""],
//       identityIssueDate: ["", Validators.compose([Validators.required])],
//       idType: ["", Validators.compose([Validators.required])],
//       region: ["", Validators.compose([Validators.required])],
//       city: ["", Validators.compose([Validators.required])],
//       subCity: ["", Validators.compose([Validators.required])],
//       regionOther: [""],
//       cityOther: [""],
//       subCityOther: [""],
//       woreda: ["", Validators.compose([Validators.required])],
//       houseNo: ["", Validators.compose([Validators.required])],
//       identityExpiryDate: ["", Validators.compose([Validators.required])],
//       attachmentOne: ["", Validators.compose([Validators.required])],
//       attachmentTwo: [""],
//       attachmentThree: [""],
//       t24AccountNum: [""],
//     });
//   }
//   nextStep() {
//     $(document).ready(function () {
//       $("#profile").addClass("active");
//       $("#home").removeClass("active");
//     });
//   }
//   nextStep1() {
//     $(document).ready(function () {
//       $("#profile1").addClass("active");
//       $("#profile").removeClass("active");
//     });
//   }
//   nextStep2() {
//     $(document).ready(function () {
//       $("#profile2").addClass("active");
//       $("#profile1").removeClass("active");
//     });
//   }
//   backStep() {
//     $(document).ready(function () {
//       $("#home").addClass("active");
//       $("#profile").removeClass("active");
//     });
//   }
//   backStep1() {
//     $(document).ready(function () {
//       $("#profile").addClass("active");
//       $("#profile1").removeClass("active");
//     });
//   }
//   backStep2() {
//     $(document).ready(function () {
//       $("#profile1").addClass("active");
//       $("#profile2").removeClass("active");
//     });
//   }
//   private markFormGroupTouched(controls) {
//     // (<any>Object).values(controls).forEach((control) => {
//     //   control.markAsTouched();
//     // });
//     Object.keys(controls).map(function (key) {
//       controls[key].markAsTouched();
//     });
//   }
//   getIdentityTypes() {
//     // this.ngProgress.start();
//     let token = this.cookieService.get("agt_token");
//     let lng = JSON.parse(this.cookieService.get("agtLng"));
//     const headers = new HttpHeaders({
//       "Content-Type": "application/json",
//       lng: lng.code,
//       "x-auth-token": token,
//       SERVICE_WRAPPER: "WRMAL_095",
//     });

//     return this.http
//       .get<string>(`${environment.secureUrl}`, {
//         headers,
//         responseType: "text" as "json",
//       })
//       .subscribe(
//         async (response) => {
//           let identitiesObj: any = this.encryption.decrypt(response);
//           this.idTypes = identitiesObj.body;
//           console.log("identitiesObj", identitiesObj);
//          // this.ngProgress.done();;
//           this.error = "";
//         },
//         async (error) => {
//           try {
//             let response: any = this.encryption.decrypt(error.error)!;

//             this.error = response.msgWithLanguage;
//             if (response.status === 500) {
//               this.error = await this.findAllLanguagesService.getTranslate(
//                 "tech_issue"
//               );
//             }
//             this.toaster.showError(this.error);
//             if (response.status === 401) {
//               this.authService.logoutUser();
//             }
//            // this.ngProgress.done();;
//           } catch {
//             let response2: any = error;

//             this.error = response2.msgWithLanguage;
//             if (response2.status === 500) {
//               this.error = await this.findAllLanguagesService.getTranslate(
//                 "tech_issue"
//               );

//               this.toaster.showError(this.error);
//             }
//             if (response2.status === 401) {
//               this.toaster.showError("Session Time out");
//               this.authService.logoutUser();
//             }
//            // this.ngProgress.done();;
//           }
//         }
//       );
//   }
//   getCountries() {
//     // this.ngProgress.start();
//     let lng = JSON.parse(this.cookieService.get("agtLng"));
//     const headers = new HttpHeaders({
//       "Content-Type": "application/json",
//       lng: lng.code,
//       SERVICE_WRAPPER: "WRMAL_086",
//     });

//     return this.http
//       .get<string>(`${environment.secureUrl}`, {
//         headers,
//         responseType: "text" as "json",
//       })
//       .subscribe(
//         async (response) => {
//           let countriesObj: any = this.encryption.decrypt(response);
//           this.countries = countriesObj.body;
//           console.log("countriesObj", countriesObj);

//          // this.ngProgress.done();;
//           this.error = "";
//         },
//         async (error) => {
//           try {
//             let response: any = this.encryption.decrypt(error.error)!;

//             this.error = response.msgWithLanguage;
//             if (response.status === 500) {
//               this.error = await this.findAllLanguagesService.getTranslate(
//                 "tech_issue"
//               );
//             }
//             this.toaster.showError(this.error);
//             if (response.status === 401) {
//               this.authService.logoutUser();
//             }
//            // this.ngProgress.done();;
//           } catch {
//             let response2: any = error;

//             this.error = response2.msgWithLanguage;
//             if (response2.status === 500) {
//               this.error = await this.findAllLanguagesService.getTranslate(
//                 "tech_issue"
//               );

//               this.toaster.showError(this.error);
//             }
//             if (response2.status === 401) {
//               this.toaster.showError("Session Time out");
//               this.authService.logoutUser();
//             }
//            // this.ngProgress.done();;
//           }
//         }
//       );
//   }
//   async register() {
//     // this.openDialog();
//     this.markFormGroupTouched(this.createWalletForm.controls);
//     // this.ngProgress.start();
//     console.log("form controls", this.createWalletForm.controls);

//     if (this.createWalletForm.valid) {
//       let birthDate = this.datepipe.transform(
//         this.createWalletForm.value.birthDate,
//         "yyyy-MM-dd"
//       );
//       let identityIssueDate = this.datepipe.transform(
//         this.createWalletForm.value.identityIssueDate,
//         "yyyy-MM-dd"
//       );
//       let identityExpiryDate = this.datepipe.transform(
//         this.createWalletForm.value.identityExpiryDate,
//         "yyyy-MM-dd"
//       );
//       let body = {
//         firstName: this.createWalletForm.value.firstName,
//         secondName: this.createWalletForm.value.secondName,
//         lastName: this.createWalletForm.value.lastName,
//         motherName: this.createWalletForm.value.motherName,
//         mobileNo: this.createWalletForm.value.mobileNo,
//         email: this.createWalletForm.value.email,
//         // address: this.createWalletForm.value.region.caption,
//         countryId: this.createWalletForm.value.idCountry.countryId,
//         gender: this.createWalletForm.value.gender,
//         identityNo: this.createWalletForm.value.idNumber,
//         attachmentOne: this.createWalletForm.value.attachmentOne,
//         attachmentTwo: this.createWalletForm.value.attachmentTwo
//           ? this.createWalletForm.value.attachmentTwo
//           : null,
//         attachmentThree: this.createWalletForm.value.attachmentThree
//           ? this.createWalletForm.value.attachmentThree
//           : null,
//         birthDate: birthDate,
//         identityIssueDate: identityIssueDate,
//         identityExpiryDate: identityExpiryDate,
//         identityTypeId: this.createWalletForm.value.idType.identityTypeId,
//         t24AccountNum: this.createWalletForm.value.t24AccountNum,
//         regionId: this.createWalletForm.value.region.regionId,
//         regionOther: this.createWalletForm.value.regionOther,
//         cityId: this.createWalletForm.value.city.cityId,
//         cityOther: this.createWalletForm.value.cityOther,
//         subCityId: this.createWalletForm.value.subCity.subCityId,
//         subCityOther: this.createWalletForm.value.subCityOther,
//         woreda: this.createWalletForm.value.woreda,
//         houseNo: this.createWalletForm.value.houseNo,
//       };
//       console.log("body", body);

//       let request_options: any = {
//         method: "POST",
//         path: "",
//         body: body,
//       };
//       this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_047");

//       let response = await this.httpService.http_request(request_options);
//       console.log("register", response.body);
//       if (response.status == 201) {
//         this.createdWallet = response;
//         console.log("this.createdWallet", this.createdWallet);

//         let doneMessage = await this.findAllLanguagesService.getTranslate(
//           "operation_done"
//         );
//         this.toaster.showSuccess(doneMessage);
//         setTimeout(() => this.openDialog(), 2500);

//         this.createWalletForm.reset();
//         this.createWalletForm.controls["idType"].setValue(1);
//        // this.ngProgress.done();;
//       } else if (response.status == 401) {
//         this.authService.logoutUser();
//        // this.ngProgress.done();;
//       } else if (response.status == 500) {
//         this.showErrorMsg = true;
//         let tecErr = await this.findAllLanguagesService.getTranslate(
//           "tech_issue"
//         );
//         this.toaster.showError(tecErr);
//        // this.ngProgress.done();;
//         this.errorMsg = tecErr;
//       } else {
//        // this.ngProgress.done();;
//         this.toaster.showError(response.msgWithLanguage);
//       }
//     } else {
//       Swal({
//         title: "Error",
//         text: await this.findAllLanguagesService.getTranslate(
//           "Please Make sure all fields are valid!"
//         ),
//         type: "error",
//         showCancelButton: false,
//         showCloseButton: true,
//       });
//     }
//   }
//   openDialog() {
//     // const dialogRef = this.dialog.open(DialogContentDialog2);
//     const dialogRef = this.dialog.open(DialogContentDialog2, {
//       data: this.createdWallet.body,
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       console.log(`Dialog result: ${result}`);
//     });
//   }

//   idTypeChange() {
//     if (this.createWalletForm.controls["idType"].value) {
//       if (this.createWalletForm.controls["idType"].value.identityTypeId != 3) {
//         this.createWalletForm.controls["idCountry"].setValue("");
//       }
//     }
//   }
//   async regionsCall() {
//     this.request_options.path = "";
//     this.request_options.method = "GET";
//     this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_172");
//     let response = await this.httpService.http_request(this.request_options);

//     // this.ngProgress.start();
//     if (response.status == 200) {
//       this.regions = response.body;
//      // this.ngProgress.done();;
//     }
//     console.log("regions", this.regions);
//   }
//   async cityCall(regionId) {
//     this.request_options.path = "";
//     this.request_options.method = "GET";
//     this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_173");
//     this.httpService.setHeader("SERVICE_PARAM", `regionId=${regionId}`);
//     let response = await this.httpService.http_request(this.request_options);

//     // this.ngProgress.start();
//     if (response.status == 200) {
//       this.cities = response.body;
//      // this.ngProgress.done();;
//     } else if (response.status == 401) {
//       this.authService.logoutUser();
//      // this.ngProgress.done();;
//     } else if (response.status == 500) {
//       this.showErrorMsg = true;
//       let tecErr = await this.findAllLanguagesService.getTranslate(
//         "tech_issue"
//       );
//       this.toaster.showError(tecErr);
//      // this.ngProgress.done();;
//       this.errorMsg = tecErr;
//       console.log("cities", this.cities);
//     }
//   }
//   async subCityCall(cityId) {
//     this.request_options.path = "";
//     this.request_options.method = "GET";
//     this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_171");
//     this.httpService.setHeader("SERVICE_PARAM", `cityId=${cityId}`);

//     let response = await this.httpService.http_request(this.request_options);

//     // this.ngProgress.start();
//     if (response.status == 200) {
//       this.subCities = response.body;
//      // this.ngProgress.done();;
//     } else if (response.status == 401) {
//       this.authService.logoutUser();
//      // this.ngProgress.done();;
//     } else if (response.status == 500) {
//       this.showErrorMsg = true;
//       let tecErr = await this.findAllLanguagesService.getTranslate(
//         "tech_issue"
//       );
//       this.toaster.showError(tecErr);
//      // this.ngProgress.done();;
//       this.errorMsg = tecErr;
//     }

//     console.log("subCities", this.subCities);
//   }
//   regionChange(event) {
//     if (event) {
//       this.cityCall(event.regionId);
//       if (this.createWalletForm.controls["region"].value.caption == "Other") {
//         this.createWalletForm
//           .get("regionOther")
//           .setValidators([Validators.required]);
//         this.createWalletForm.get("regionOther").updateValueAndValidity();
//         this.showOtherRegion = true;
//       } else {
//         this.showOtherRegion = false;
//         // this.createWalletForm.get("regionOther").setValidators(null);
//         this.createWalletForm.get("regionOther").clearValidators();
//         this.createWalletForm.get("regionOther").updateValueAndValidity();
//       }
//     }
//   }
//   cityChange(event) {
//     if (event) {
//       this.subCityCall(event.cityId);

//       if (this.createWalletForm.controls["city"].value.caption == "Other") {
//         this.createWalletForm
//           .get("cityOther")
//           .setValidators([Validators.required]);
//         this.createWalletForm.get("cityOther").updateValueAndValidity();
//         this.showOtherCity = true;
//       } else {
//         this.showOtherCity = false;
//         // this.createWalletForm.get("cityOther").setValidators(null);
//         this.createWalletForm.get("cityOther").clearValidators();
//         this.createWalletForm.get("cityOther").updateValueAndValidity();
//       }
//     }
//   }
//   subCityChange(event?) {
//     if (event) {
//       if (this.createWalletForm.controls["subCity"].value.caption == "Other") {
//         this.createWalletForm
//           .get("subCityOther")
//           .setValidators([Validators.required]);
//         this.createWalletForm.get("subCityOther").updateValueAndValidity();
//         this.showOtherSubCity = true;
//       } else {
//         this.showOtherSubCity = false;
//         // this.createWalletForm.get("subCityOther").setValidators(null);
//         this.createWalletForm.get("subCityOther").clearValidators();
//         this.createWalletForm.get("subCityOther").updateValueAndValidity();
//       }
//     }
//   }
// }

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
