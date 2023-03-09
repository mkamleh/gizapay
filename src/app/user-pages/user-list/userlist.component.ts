/** @format */

import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { trigger, transition, animate, style } from "@angular/animations";
import { NgxSmartModalService } from "ngx-smart-modal";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { ModalDirective } from "angular-bootstrap-md";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidation } from "app/_services/custom-validator.service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import { CustomValidators } from "ng2-validation";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";

@Component({
  selector: "ms-userlist",
  templateUrl: "./userlist-component.html",
  styleUrls: ["./userlist-component.scss"],
  encapsulation: ViewEncapsulation.None,

  animations: [
    trigger("slideInOut", [
      transition(":enter", [
        style({ transform: "scale3d(.3, .3, .3)" }),
        animate(500),
      ]),
      transition(":leave", [
        animate(500, style({ transform: "scale3d(.0, .0, .0)" })),
      ]),
    ]),
  ],
})
export class UserListComponent implements OnInit {
  visible = false;
  visible1 = true;

  branchList: any;

  userId: any;
  phoneFlage;
  phoneFlage1;

  users: any;
  isRequired = false;

  modalTitle: string;

  addUserForm: FormGroup;

  updateUserForm: FormGroup;

  title: String = "Users_List";

  userRoleList: any = [];

  count = 50;
  offset = 0;
  rows: any;
  temp: any = [];

  currentUser: any = {
    id: null,
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    userRoleId: null,
    countryCode: null,
    password: null,
  };

  currentDate: Date = new Date();
  layoutDir: any;

  
  pageTitle: string = "User Managment";
  showErrorMsg: boolean;
  errorMsg: any;

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private httpService: HttpService,
    private customValidation: CustomValidation,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    private cookieService: CookieService,
    public ngProgress: NgProgress
  ) {
    this._sharedService.emitChange(this.pageTitle);

    let lng = JSON.parse(this.cookieService.get("agtLng"));
    this.layoutDir = lng.direction;
  }
  async ngOnInit() {
    // this.getAllUsers();
    // this.loadUserRoles();
    // this.loadAddForm();
    // this.loadUpdateForm();
  }

  // loadAddForm() {
  //   this.addUserForm = new FormGroup({
  //     username: new FormControl("", [
  //       Validators.required,
  //       Validators.minLength(6),
  //       Validators.maxLength(16),
  //       this.customValidation.hasArabic(),
  //     ]),
  //     firstName: new FormControl("", [
  //       Validators.required,
  //       Validators.minLength(2),
  //       Validators.maxLength(20),
  //       Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
  //     ]),
  //     lastName: new FormControl("", [
  //       Validators.required,
  //       Validators.minLength(2),
  //       Validators.maxLength(20),
  //       Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
  //     ]),
  //     mobile: new FormControl("", Validators.required),
  //     email: new FormControl("", [
  //       CustomValidators.email,
  //       this.customValidation.hasArabic(),
  //     ]),
  //     userRoleId: new FormControl("", Validators.required),
  //     countryCode: new FormControl("966", Validators.required),
  //   });
  // }

  // loadUpdateForm() {
  //   this.updateUserForm = new FormGroup({
  //     firstName: new FormControl(this.currentUser.firstName, [
  //       Validators.required,
  //       Validators.minLength(2),
  //       Validators.maxLength(20),
  //       Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
  //     ]),
  //     lastName: new FormControl(this.currentUser.lastName, [
  //       Validators.required,
  //       Validators.minLength(2),
  //       Validators.maxLength(20),
  //       Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
  //     ]),
  //     mobile: new FormControl(this.currentUser.mobile, Validators.required),
  //     email: new FormControl(this.currentUser.email, [
  //       CustomValidators.email,
  //       this.customValidation.hasArabic(),
  //     ]),
  //     userRoleId: new FormControl(
  //       this.currentUser.userRoleId,
  //       Validators.required
  //     ),
  //     countryCode: new FormControl("966"),
  //     id: new FormControl(this.currentUser.id),
  //   });
  // }

  // async loadUserRoles() {
  //   let request_options: any = {
  //     method: "GET",
  //     path: "",
  //   };
  //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_153");

  //   let response = await this.httpService.http_request(request_options);

  //   // this.ngProgress.start();
  //   if (response.status == 200) {
  //     this.userRoleList = response.body;
  //    // this.ngProgress.done();;
  //   } else if (response.status == 401) {
  //     this.authService.logoutUser();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 500) {
  //     this.showErrorMsg = true;
  //     let tecErr = await this.findAllLanguagesService.getTranslate(
  //       "tech_issue"
  //     );
  //     this.toaster.showError(tecErr);
  //    // this.ngProgress.done();;
  //     this.errorMsg = tecErr;
  //   } else {
  //     this.toaster.showError(response.text);
  //    // this.ngProgress.done();;
  //   }
  // }

  // // changeState1() {
  // //   this.visible = this.visible === false ? true : false;
  // // }

  // changeState1() {
  //  console.log("im working as its should");
   
  //   this.visible = true;
  //   this.visible1 = false;
  //   this.title = "Add_User";
   
  // }

  // changeState2() {
  //   this.visible = false;
  //   this.visible1 = true;
  //   this.title = "Users_List";
  // }

  // async getAllUsers() {
  //   let request_options: any = {
  //     method: "GET",
  //     path: "",
  //   };

  //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_031");
  //   let response = await this.httpService.http_request(request_options);

  //   // this.ngProgress.start();
  //   if (response.status == 200) {
  //     this.users = response.body;
  //     let detailedRrows = response.body;
  //     console.log("getAllUsers >>>", response.body);

  //     this.count = this.users.length;
  //     this.rows = detailedRrows.map((item) => {
  //       return {
  //         id: item.id,
  //         fullName:
  //           this.toTitleCase(item.firstName) +
  //           " " +
  //           this.toTitleCase(item.lastName),
  //         firstName: item.firstName,
  //         lastName: item.lastName,
  //         username: item.username,
  //         userRoleId: item.userRoleId,
  //         userRoleCaption: item.userRoleCaption,
  //         email: item.email,
  //         mobile: item.mobile,
  //         statusCode: item.statusCode,
  //         branch: item.branchResource.captionResources[0].name,
  //       };
  //     });
  //     // cache our list
  //     this.temp = [...this.rows];
  //    // this.ngProgress.done();;
  //   } else if (response.status == 401) {
  //     this.authService.logoutUser();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 500) {
  //     this.showErrorMsg = true;
  //     let tecErr = await this.findAllLanguagesService.getTranslate(
  //       "tech_issue"
  //     );
  //     this.toaster.showError(tecErr);
  //    // this.ngProgress.done();;
  //     this.errorMsg = tecErr;
  //   } else {
  //     this.toaster.showError(response.text);
  //    // this.ngProgress.done();;
  //   }
  // }

  // showUserModal(item) {
  //   this.currentUser = item;
  //   this.loadUpdateForm();
  //   this.userModal.show();
  // }

  // showResetModal(userid) {
  //   this.userId = userid;
  //   this.resetModal.show();
  // }

  // showDeleteModal(userid) {
  //   this.userId = userid;
  //   this.deleteModal.show();
  // }

  // async addUserFormSubmit() {
  //   // this.ngProgress.start();
  //   this.phoneFlage = "1";

  //   this.markFormGroupTouched(this.addUserForm.controls);

  //   if (this.addUserForm.valid) {
  //     let request_options: any = {
  //       method: "POST",
  //       path: "",
  //       body: this.addUserForm.value,
  //     };
  //     this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_033");
  //     let response = await this.httpService.http_request(request_options);

  //     if (response.status == 201) {
  //       this.visible = false;
  //       this.visible1 = true;
  //       this.title = "Users_List";
  //       this.toaster.showSuccess(
  //         this.operationLanguage.getTranslate("operation_done")
  //       );
  //       this.currentUser = response.body;
  //       this.printModal.show();
  //       this.getAllUsers();
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
  //     } else {
  //       this.toaster.showError(response.text);
  //      // this.ngProgress.done();;
  //     }
  //   }
  // }

  // async resetPasswordUser() {
  //   console.log("resetPasswordUser >>>>>>>");
  //   // this.ngProgress.start();

  //   let body = {
  //     id: this.userId,
  //   };

  //   let request_options: any = {
  //     method: "PUT",
  //     path: "",
  //     body: body,
  //   };
  //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_035");
  //   let response = await this.httpService.http_request(request_options);

  //   if (response.status == 200) {
  //     this.resetModal.hide();
  //     this.toaster.showSuccess(
  //       this.operationLanguage.getTranslate("operation_done")
  //     );
  //     this.userId = null;
  //     this.currentUser = response.body;
  //     this.printModal.show();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 401) {
  //     this.authService.logoutUser();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 500) {
  //     this.showErrorMsg = true;
  //     let tecErr = await this.findAllLanguagesService.getTranslate(
  //       "tech_issue"
  //     );
  //     this.toaster.showError(tecErr);
  //    // this.ngProgress.done();;
  //     this.errorMsg = tecErr;
  //   } else {
  //     this.toaster.showError(response.text);
  //    // this.ngProgress.done();;
  //     this.resetModal.hide();
  //     this.userId = null;
  //   }
  // }

  // async deleteUser() {
  //   console.log("deleteUser >>>>>>>");
  //   // this.ngProgress.start();

  //   let body = {
  //     id: this.userId,
  //   };

  //   let request_options: any = {
  //     method: "DELETE",
  //     path: "",
  //     body: body,
  //   };
  //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_034");
  //   let response = await this.httpService.http_request(request_options);

  //   if (response.status == 200) {
  //     this.deleteModal.hide();
  //     this.toaster.showSuccess(
  //       this.operationLanguage.getTranslate("operation_done")
  //     );
  //     this.getAllUsers();
  //     this.userId = null;
  //    // this.ngProgress.done();;
  //   } else if (response.status == 401) {
  //     this.authService.logoutUser();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 500) {
  //     this.showErrorMsg = true;
  //     let tecErr = await this.findAllLanguagesService.getTranslate(
  //       "tech_issue"
  //     );
  //     this.toaster.showError(tecErr);
  //    // this.ngProgress.done();;
  //     this.errorMsg = tecErr;
  //   } else {
  //     this.toaster.showError(response.text);
  //    // this.ngProgress.done();;
  //     this.deleteModal.hide();
  //     this.userId = null;
  //   }
  // }

  // async updateUser() {
  //   console.log("updateUser >>>>>>>");
  //   // this.ngProgress.start();

  //   this.phoneFlage1 = "1";

  //   this.markFormGroupTouched(this.updateUserForm.controls);

  //   if (this.updateUserForm.valid) {
  //     let request_options: any = {
  //       method: "PUT",
  //       path: "",
  //       body: this.updateUserForm.value,
  //     };
  //     this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_037");

  //     let response = await this.httpService.http_request(request_options);

  //     if (response.status == 201) {
  //       this.userModal.hide();
  //       this.toaster.showSuccess(
  //         this.operationLanguage.getTranslate("operation_done")
  //       );
  //       this.getAllUsers();
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
  //     } else {
  //       this.toaster.showError(response.text);
  //      // this.ngProgress.done();;
  //       this.userModal.hide();
  //     }
  //   }
  // }

  // private markFormGroupTouched(controls) {
  //   // (<any>Object).values(this.addUserForm.controls).forEach((control) => {
  //   //   control.markAsTouched();
  //   // });
  //   Object.keys(controls).map(function (key) {
  //     controls[key].markAsTouched();
  //   });
  // }

  // async onActive(QRid) {
  //   console.log(QRid);
  //   // this.ngProgress.start();
  //   console.log("onActive >>>>>>>");

  //   let body = { id: QRid };

  //   let request_options: any = {
  //     method: "PUT",
  //     path: "",
  //     body: body,
  //   };

  //   this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_036");

  //   let response = await this.httpService.http_request(request_options);

  //   console.log("esponseesponse" + response.body);

  //   if (response.status == 200) {
  //     this.toaster.showSuccess(
  //       this.operationLanguage.getTranslate("operation_done")
  //     );
  //     this.getAllUsers();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 401) {
  //     this.authService.logoutUser();
  //    // this.ngProgress.done();;
  //   } else if (response.status == 500) {
  //     this.showErrorMsg = true;
  //     let tecErr = await this.findAllLanguagesService.getTranslate(
  //       "tech_issue"
  //     );
  //     this.toaster.showError(tecErr);
  //    // this.ngProgress.done();;
  //     this.errorMsg = tecErr;
  //   } else {
  //     this.toaster.showError(response.text);
  //    // this.ngProgress.done();;
  //   }
  // }

  // print() {
  //   this.printModal.hide();
  //   var divToPrint = document.getElementById("tmodalbody");
  //   var newWin = window.open(
  //     "",
  //     "_blank",
  //     "width=800,height=500,top=100,left=100"
  //   );
  //   newWin.document.open();
  //   newWin.document.write(
  //     '<html><head><style>#printBtn {display:none}</style><body   onload="window.print()">' +
  //       divToPrint.innerHTML +
  //       "</body></html>"
  //   );
  //   newWin.document.close();
  //   //setTimeout(function () { window.location.href = 'cashin.html'; }, 10);
  // }

  // updateFilter(event) {
  //   const val = event.target.value;
  //   console.log("searche Value", val);

  //   // filter our data
  //   const temp = this.temp.filter((d) => {
  //     return (
  //       d.firstName.toLowerCase().indexOf(val) !== -1 ||
  //       !val ||
  //       d.lastName.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
  //       !val ||
  //       d.username.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
  //       !val ||
  //       d.userRoleCaption.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
  //       !val ||
  //       d.email.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
  //       !val ||
  //       d.mobile.indexOf(val) !== -1 ||
  //       !val ||
  //       d.statusCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
  //       !val
  //     );
  //   });
  //   // update the rows
  //   this.rows = temp;
  // }
  // onPage(event) {
  //   console.log("Page Event", event);
  //   // this.getQRs(event.offset);
  //   // this.page(event.offset, event.limit);
  // }

  // toTitleCase(str) {
  //   return str.replace(/\w\S*/g, function (txt) {
  //     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //   });
  // }
}
