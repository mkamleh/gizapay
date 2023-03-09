/** @format */

import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { trigger, transition, animate, style } from "@angular/animations";
import { NgxSmartModalService } from "ngx-smart-modal";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { ModalDirective } from "angular-bootstrap-md";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { CustomValidation } from "app/_services/custom-validator.service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import Swal from "sweetalert2";
import { HttpClientService } from "app/_services/HttpClientService";


@Component({
  selector: "ms-usermasterlist",
  templateUrl: "./usermasterlist-component.html",
  styleUrls: ["./usermasterlist-component.scss"],
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
export class UserListMasterComponent implements OnInit {
  visible = false;
  visible1 = true;

  branchList: any;

  userId: any;
  phoneFlage;
  phoneFlage1;
  isRequired: boolean;

  users: any;

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

  @ViewChild("userModal",{static: false}) userModal: ModalDirective;
  @ViewChild("resetModal",{static: false}) resetModal: ModalDirective;
  @ViewChild("printModal",{static: false}) printModal: ModalDirective;
  @ViewChild("deleteModal",{static: false}) deleteModal: ModalDirective;
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
    public ngProgress: NgProgress,
    private httpClientService: HttpClientService
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.loadAddForm();
    this.loadUpdateForm();
    this.getAllUsers();

    let lng = JSON.parse(this.cookieService.get("agtLng"));
    this.layoutDir = lng.direction;
  }
  async ngOnInit() {
    this.loadAddForm();
    this.loadUpdateForm();
    this.getAllUsers();
    this.loadUserRoles();
  }
  loadAddForm() {
    this.addUserForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        this.customValidation.hasArabic(),
      ]),
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern("[^,!@#$%^&*()_+?/<>0-9]+$"),
      ]),
      mobile: new FormControl("", Validators.required),
      email: new FormControl("", [
        CustomValidators.email,
        this.customValidation.hasArabic(),
      ]),
      userRoleId: new FormControl("", Validators.required),
      countryCode: new FormControl("966", Validators.required),
      branchId: new FormControl("", [Validators.required]),
    });
  }

  loadUpdateForm() {
    this.updateUserForm = new FormGroup({
      firstName: new FormControl(this.currentUser.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
      ]),
      lastName: new FormControl(this.currentUser.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF ]*$/),
      ]),
      mobile: new FormControl(this.currentUser.mobile, Validators.required),
      email: new FormControl(this.currentUser.email, [
        CustomValidators.email,
        this.customValidation.hasArabic(),
      ]),
      userRoleId: new FormControl(
        this.currentUser.userRoleId,
        Validators.required
      ),
      countryCode: new FormControl("966"),
      id: new FormControl(this.currentUser.id),
    });
  }

  loadUserRoles() {
    this.httpClientService.httpClientMainRouter("WRMAL_153",`null`,"GET")
      .subscribe( async res => {
        this.userRoleList = this._sharedService.decrypt(res).body;
        await this.getAllBranchs();
      },async err =>{
        await this.getAllBranchs();
      });    
  }

  changeState1() {
    console.log("akrema is here");
    this.visible = true;
    this.visible1 = false;
    this.title = "Add_User";

  }

  changeState2() {
    this.visible = false;
    this.visible1 = true;
    this.title = "Users_List";
  }

  getAllUsers() {
    this.httpClientService.httpClientMainRouter("WRMAL_052",`null`,"GET")
      .subscribe( res => {
        this.users = this._sharedService.decrypt(res).body;
        let detailedRrows = this._sharedService.decrypt(res).body;
        this.count = this.users.length;  
        this.rows = detailedRrows.map((item) => {
          return {
            id: item.id,
            fullName:
              this.toTitleCase(item.firstName) +
              " " +
              this.toTitleCase(item.lastName),
            firstName: item.firstName,
            lastName: item.lastName,
            username: item.username,
            userRoleId: item.userRoleId,
            userRoleCaption: item.userRoleCaption,
            email: item.email,
            mobile: item.mobile,
            statusCode: item.statusCode,
            branch: item.branchResource.captionResources[0].name,
          };
        });
        // cache our list
        this.temp = [...this.rows];
      },err =>{
      });    
  }

  showUserModal(item) {
    this.currentUser = item;
    this.loadUpdateForm();
    this.userModal.show();
  }

  showResetModal(userid) {
    this.userId = userid;
    // this.resetModal.show();
    this.resetPasswordUser();
  }

  showDeleteModal(userid) {
    this.userId = userid;
    // this.deleteModal.show();
    this.deleteUser();
  }

  addUserFormSubmit() {
    this.phoneFlage = "1";

    this.markFormGroupTouched(this.addUserForm.controls);
    // this.ngProgress.start();
    if (this.addUserForm.valid) {
      // request_options.body.branchId = this.branchList[0].id;
      this.httpClientService.httpClientMainRouter("WRMAL_053",`null`,"POST",this.addUserForm.value)
      .subscribe( res => {
        this.visible = false;
        this.visible1 = true;
        this.title = "Users_List";
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.currentUser = this._sharedService.decrypt(res).body;
        this.printModal.show();
        this.getAllUsers();
        this.addUserForm.reset()
      },err =>{
      }); 
    }
  }

  async resetPasswordUser() {
    Swal({
      title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
      text: await this.findAllLanguagesService.getTranslate(
        "Are you sure you want to reset the password?"
      ),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findAllLanguagesService.getTranslate(
        "Yes, reset password!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        let body = {
          id: this.userId,
        };
        this.httpClientService.httpClientMainRouter("WRMAL_055",`null`,"PUT",body)
      .subscribe( res => {
        this.resetModal.hide();
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.userId = null;
        this.currentUser = this._sharedService.decrypt(res).body;
        this.printModal.show();
      },err =>{
      });   
      }
    });
  }

  async deleteUser() {
    Swal({
      title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
      text: await this.findAllLanguagesService.getTranslate(
        "You won't be able to revert this!"
      ),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findAllLanguagesService.getTranslate(
        "Yes, delete it!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        let body = {
          id: this.userId,
        };
       
        this.httpClientService.httpClientMainRouter("WRMAL_054",`null`,"DELETE",body)
      .subscribe( res => {
        this.userRoleList = this._sharedService.decrypt(res).body;
        
        this.deleteModal.hide();
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.getAllUsers();
        this.userId = null;
      },err =>{
        this.deleteModal.hide();
        this.userId = null;
      });    
      }
    });
  }

  updateUser() {
    this.phoneFlage1 = "1";
    this.markFormGroupTouched(this.updateUserForm.controls);
    if (this.updateUserForm.valid) {
      let body = this.updateUserForm.value
      body.branchId = this.addUserForm.value.branchId;
      this.httpClientService.httpClientMainRouter("WRMAL_057",`null`,"PUT",body)
      .subscribe( res => {
        this.userModal.hide();
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.getAllUsers();
      },err =>{
      });    
    }
  }

  private markFormGroupTouched(controls) {
    // (<any>Object).values(controls).forEach((control) => {
    //   control.markAsTouched();
    // });
    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
    });
  }

  async onActive(QRid) {
    Swal({
      title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
      text: await this.findAllLanguagesService.getTranslate(
        "Are you sure you want to change the status?"
      ),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findAllLanguagesService.getTranslate(
        "Yes, change status!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        let body = { id: QRid };
        this.httpClientService.httpClientMainRouter("WRMAL_056",`null`,"PUT",body)
      .subscribe( res => {
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.getAllUsers();
      },err =>{
      });    
      }
    });
  }

  print() {
    this.printModal.hide();
    var divToPrint = document.getElementById("tmodalbody");
    var newWin = window.open(
      "",
      "_blank",
      "width=800,height=500,top=100,left=100"
    );
    newWin.document.open();
    newWin.document.write(
      '<html><head><style>#printBtn {display:none}</style><body   onload="window.print()">' +
        divToPrint.innerHTML +
        "</body></html>"
    );
    newWin.document.close();
    //setTimeout(function () { window.location.href = 'cashin.html'; }, 10);
  }

  getAllBranchs() {   
    this.httpClientService.httpClientMainRouter("WRMAL_061",`null`,"GET")
      .subscribe( res => {
        this.branchList = this._sharedService.decrypt(res).body;
      },err =>{
      });    
  }

  updateFilter(event) {
    const val = event.target.value;
    console.log("searche Value", val);

    // filter our data
    const temp = this.temp.filter((d) => {
      console.log(d,"temp");

      return (
        d.fullName.indexOf(val) !== -1 ||
        !val  ||
          d.username.indexOf(val) !== -1 || !val 
          ||
          // d.email.indexOf(val) !== -1 || !val 
          d.branch.indexOf(val) !== -1 || !val ||
          d.statusCode.indexOf(val) !== -1 || !val ||
d.mobile.indexOf(val) !== -1 ||
        !val 
        
    
      );
    });
    // update the rows
    this.rows = temp;
  }
  onPage(event) {
    console.log("Page Event", event);
    // this.getQRs(event.offset);
    // this.page(event.offset, event.limit);
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
