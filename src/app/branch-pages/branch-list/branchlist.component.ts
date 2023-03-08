/** @format */

import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Inject,
} from "@angular/core";
import { trigger, transition, animate, style } from "@angular/animations";
import { NgxSmartModalService } from "ngx-smart-modal";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { HttpService } from "app/_services/HttpService";
import { ModalDirective } from "angular-bootstrap-md";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { CustomValidation } from "app/_services/custom-validator.service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import Swal from "sweetalert2";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { NgProgress } from "ngx-progressbar";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { CookieService } from "ngx-cookie-service";
import { Encryption } from "app/_services/Encryption";
export interface DialogData {
  id: any;
  name: any;
  subWalletId: any;
  code: any;
}
@Component({
  selector: "ms-branchlist",
  templateUrl: "./branchlist-component.html",
  styleUrls: ["./branchlist-component.scss"],
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
export class BranchListComponent implements OnInit {
  visible = false;
  visible1 = true;
  name: string;

  userId: any;
  phoneFlage;
  phoneFlage1;

  branchs: any;

  modalTitle: string;

  addBranchForm: FormGroup;

  updateUserForm: FormGroup;

  title: String = "Branch_List";

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

  lat: any = 8.9806;
  long: any = 38.7578;
  zoom = 17;
  marker_lat: any;
  marker_long: any;

  lngs = [];
  branchObj: any = {};
  showLangButton = false;

  private request_optionsLng: any = {
    method: "GET",
    path: "",
    body: "",
  };

  private request_optionsAdd: any = {
    method: "POST",
    path: "",
    body: "",
  };

  @ViewChild("userModal") userModal: ModalDirective;
  @ViewChild("resetModal") resetModal: ModalDirective;
  @ViewChild("printModal") printModal: ModalDirective;
  @ViewChild("deleteModal") deleteModal: ModalDirective;
  editEnable: boolean;
  pageTitle: any = "branch_management";
  showErrorMsg: boolean;
  errorMsg: string;

  count = 50;
  offset = 0;
  rows: any;
  temp: any = [];
  captions: any[] = [];
  langs: any[] = [];
  allLangs: any[] = [];
  configId: any;
  cardTitle: string;
  isUpdate: boolean = false;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    public dialog: MatDialog,
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.operationLanguage.removeAllLanguage();
    this.operationLanguage.getAllLanguage();
    this.lngs = this.operationLanguage.languages;
  }
  async ngOnInit() {
    this.cardTitle = "Add New Branch";
    this.getAllLanguages();
    this.getLanguages();
    this.loadAddForm();
    this.loadUpdateForm();

    this.getAllBranchs();
  }
  loadAddForm() {
    this.addBranchForm = new FormGroup({
      language: new FormControl(""),
      name: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern("^[a-zA-Zء-ي ]*$"),
          Validators.required,
        ])
      ),
      address: new FormControl(
        "",
        Validators.compose([Validators.minLength(2)])
      ),
      longitude: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^(\\+|-)?((\\d((\\.)|\\.\\d{1,16})?)|(0*?\\d\\d((\\.)|\\.\\d{1,16})?)|(0*?1[0-7]\\d((\\.)|\\.\\d{1,16})?)|(0*?180((\\.)|\\.0{1,16})?))$"
          ),
        ])
      ),
      latitude: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^(\\+|-)?((\\d((\\.)|\\.\\d{1,16})?)|(0*?[0-8]\\d((\\.)|\\.\\d{1,16})?)|(0*?90((\\.)|\\.0{1,16})?))$"
          ),
        ])
      ),
    });
  }

  addCaption() {
    if (
      this.addBranchForm.controls["language"].valid &&
      this.addBranchForm.controls["name"].valid &&
      this.addBranchForm.controls["address"].valid
    ) {
      this.addBranchForm.get("language").setValidators(Validators.required);
      this.addBranchForm.get("language").updateValueAndValidity();
      this.addBranchForm.get("language").markAsTouched();
      this.addBranchForm.get("name").setValidators(Validators.required);
      this.addBranchForm.get("name").updateValueAndValidity();
      this.addBranchForm.get("name").markAsTouched();
      this.addBranchForm.get("address").setValidators(Validators.required);
      this.addBranchForm.get("address").updateValueAndValidity();
      this.addBranchForm.get("address").markAsTouched();

      if (
        this.addBranchForm.get("language").valid &&
        this.addBranchForm.get("name").valid &&
        this.addBranchForm.get("address").valid
      ) {
        let obj = {
          name: this.addBranchForm.value.name,
          operationLanguageId: this.addBranchForm.value.language.id,
          language: this.addBranchForm.value.language,
          languageName: this.addBranchForm.value.language.name,
          address: this.addBranchForm.value.address,
        };
        this.captions.push(obj);
        this.langs.splice(
          this.langs.indexOf(this.addBranchForm.value.language),
          1
        );

        this.addBranchForm.get("name").setErrors(null);
        this.addBranchForm.get("language").setErrors(null);
        this.addBranchForm.get("address").setErrors(null);

        this.addBranchForm.get("name").reset();
        this.addBranchForm.get("language").reset();
        this.addBranchForm.get("address").reset();

        this.addBranchForm.get("name").clearValidators();
        this.addBranchForm.get("language").clearValidators();
        this.addBranchForm.get("address").clearValidators();

        this.addBranchForm.get("name").updateValueAndValidity();
        this.addBranchForm.get("language").updateValueAndValidity();
        this.addBranchForm.get("address").updateValueAndValidity();
      }
    }
  }
  deleteCaption(caption) {
    console.log("ccc", caption);
    console.log("allLangs", this.allLangs);

    this.captions.splice(this.captions.indexOf(caption), 1);

    let selectedLanguage = this.allLangs.find(
      (x) => x.id === caption.operationLanguageId
    );

    this.langs.push(selectedLanguage);
  }

  async getLanguages() {
    this.request_options.method = "GET";
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_118");
    // this.request_options.path = `operationlanguage/findAll`;
    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      this.langs = response.body;
    }
  }
  async getAllLanguages() {
    this.request_options.method = "GET";
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_118");
    // this.request_options.path = `operationlanguage/findAll`;
    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      this.allLangs = response.body;
    }
  }

  async saveBranch() {
    this.addBranchForm.get("name").setErrors(null);
    this.addBranchForm.get("language").setErrors(null);
    this.addBranchForm.get("address").setErrors(null);

    this.addBranchForm.get("name").reset();
    this.addBranchForm.get("language").reset();
    this.addBranchForm.get("address").reset();

    this.addBranchForm.get("name").clearValidators();
    this.addBranchForm.get("language").clearValidators();
    this.addBranchForm.get("address").clearValidators();

    this.addBranchForm.get("name").updateValueAndValidity();
    this.addBranchForm.get("language").updateValueAndValidity();
    this.addBranchForm.get("address").updateValueAndValidity();
    this.markFormGroupTouched(this.addBranchForm.controls);

    if (this.captions.length <= 0) {
      Swal({
        title: "Error",
        text: await this.findAllLanguagesService.getTranslate(
          "Please add Branch Name and Branch Address in one language at least!"
        ),
        type: "error",
        showCancelButton: false,
        showCloseButton: true,
      });
      return;
    }
    if (this.addBranchForm.valid && this.captions.length > 0) {
      this.request_optionsAdd.path = "";
      this.request_optionsAdd.method = "POST";
      this.request_optionsAdd.body = {
        longitude: this.addBranchForm.value.longitude.toString(),
        latitude: this.addBranchForm.value.latitude.toString(),
        captionResources: this.captions,
      };
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_062");

      let response = await this.httpService.http_request(
        this.request_optionsAdd
      );
      console.log("service");

      if (response.status == 201) {
        console.log(response.body);
        await this.getAllBranchs();
        this.visible = false;
        this.visible1 = true;
        this.title = "Branch_List";
        this.addBranchForm.reset();
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.lngs = this.operationLanguage.languages;
        this.captions = [];
        this.getLanguages();
      } else if (response.status == 401) {
        this.authService.logoutUser();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);

        this.errorMsg = tecErr;
      } else {
        this.toaster.showError(response.msgWithLanguage);
        this.lngs = this.operationLanguage.languages;
      }
    }
  }
  async getbyId(id) {
    this.request_options.method = "GET";
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_068");
    this.httpService.setHeader("SERVICE_PARAM", "branchId=" + id);
    let response = await this.httpService.http_request(this.request_options);
    if (response.status == 200) {
      this.configId = id;
      this.isUpdate = true;
      this.cardTitle = "Update Branch";
      console.log("res", response.body);

      this.changeState1();

      this.addBranchForm.get("longitude").setValue(response.body.longitude);
      this.addBranchForm.get("latitude").setValue(response.body.latitude);

      this.captions = response.body.captionResources;
      this.captions.forEach((q) => {
        let lang = this.langs.find((x) => x.id === q.operationLanguageId);
        this.langs.splice(this.langs.indexOf(lang), 1);
      });
    } else if (response.status == 401) {
      this.authService.logoutUser();
      this.ngProgress.done();
    } else if (response.status == 500) {
      this.toaster.showError(
        await this.findAllLanguagesService.getTranslate("tech_issue")
      );
      this.ngProgress.done();
    } else {
      this.toaster.showError(response.msgWithLanguage);
    }
    this.ngProgress.done();
  }

  async updateBranch() {
    this.addBranchForm.get("name").setErrors;

    this.addBranchForm.get("name").setErrors(null);
    this.addBranchForm.get("language").setErrors(null);
    this.addBranchForm.get("address").setErrors(null);

    this.addBranchForm.get("name").reset();
    this.addBranchForm.get("language").reset();
    this.addBranchForm.get("address").reset();

    // this.addBranchForm.get("name").clearValidators();
    this.addBranchForm.get("language").clearValidators();
    this.addBranchForm.get("address").clearValidators();

    this.addBranchForm.get("name").updateValueAndValidity();
    this.addBranchForm.get("language").updateValueAndValidity();
    this.addBranchForm.get("address").updateValueAndValidity();
    this.markFormGroupTouched(this.addBranchForm.controls);

    if (this.captions.length <= 0) {
      Swal({
        title: "Error",
        text: await this.findAllLanguagesService.getTranslate(
          "Please add Branch Name and Branch Address in one language at least!"
        ),
        type: "error",
        showCancelButton: false,
        showCloseButton: true,
      });
      return;
    }
    if (this.addBranchForm.valid && this.captions.length > 0) {
      this.request_optionsAdd.path = "";
      this.request_optionsAdd.method = "POST";
      this.request_optionsAdd.body = {
        id: this.configId,
        longitude: this.addBranchForm.value.longitude.toString(),
        latitude: this.addBranchForm.value.latitude.toString(),
        captionResources: this.captions,
      };
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_408");

      let response = await this.httpService.http_request(
        this.request_optionsAdd
      );
      console.log("service");

      if (response.status == 200) {
        console.log(response.body);
        await this.getAllBranchs();
        this.visible = false;
        this.visible1 = true;
        this.title = "Branch_List";
        this.addBranchForm.reset();
        this.toaster.showSuccess(
          this.operationLanguage.getTranslate("operation_done")
        );
        this.lngs = this.operationLanguage.languages;
        this.captions = [];
        this.getLanguages();
        this.addBranchForm.reset();

        this.isUpdate = false;
      } else if (response.status == 401) {
        this.authService.logoutUser();
      } else if (response.status == 500) {
        this.showErrorMsg = true;
        let tecErr = await this.findAllLanguagesService.getTranslate(
          "tech_issue"
        );
        this.toaster.showError(tecErr);

        this.errorMsg = tecErr;
      } else {
        this.toaster.showError(response.msgWithLanguage);
        this.lngs = this.operationLanguage.languages;
      }
    }
  }

  loadUpdateForm() {
    this.updateUserForm = new FormGroup({
      username: new FormControl(this.currentUser.username, Validators.required),
      firstName: new FormControl(
        this.currentUser.firstName,
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern("^[a-zA-Z ]*$"),
        ])
      ),
      lastName: new FormControl(this.currentUser.lastName, Validators.required),
      mobile: new FormControl(this.currentUser.mobile, Validators.required),
      email: new FormControl(this.currentUser.email, Validators.required),
      countryCode: new FormControl("966"),
      id: new FormControl(this.currentUser.id),
    });
  }

  changeState1() {
    this.captions = [];
    this.visible = true;
    this.visible1 = false;
    this.title = "Add_User";
    this.cardTitle = "Add New Branch";
  }

  closeForm() {
    this.visible = false;
    this.visible1 = true;
    this.title = "Users_List";
  }

  async getAllBranchs() {
    console.log("getAllbranches >>>>>>>");

    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_061");

    let response = await this.httpService.http_request(request_options);

    this.ngProgress.start();
    if (response.status == 200) {
      this.branchs = response.body;
      let detailedRrows = response.body;
      console.log("response.body", response.body);
      // push our inital complete list
      this.count = this.branchs.length;
      this.rows = detailedRrows.map((item) => {
        return {
          id: item.branchResource.id,
          walletId: item.id,
          code: item.branchResource.code,
          branchCaption: item.branchResource.branchCaption,
          statusCaption: item.branchResource.statusCaption,
          address: item.branchResource.captionResources[0].address,
          statusCode: item.branchResource.statusCode,
          availableBalance: item.availableBalance + " ETB",
          currentBalance: item.currentBalance + " ETB",
          reservedBalance: item.reservedBalance + " ETB",
        };
      });
      // cache our list
      this.temp = [...this.rows];

      console.log("response.body", response.body);
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
      this.toaster.showError(response.text);
    }
  }

  showUserModal(item) {
    this.currentUser = item;
    this.loadUpdateForm();
    this.userModal.show();
  }

  showResetModal(userid) {
    this.userId = userid;
    this.resetModal.show();
  }

  showDeleteModal(userid) {
    this.userId = userid;
    this.deleteModal.show();
  }

  // async addBranchFormSubmit() {
  //   this.phoneFlage = "1";

  //   this.markFormGroupTouched();

  //   if (this.addBranchForm.valid) {
  //     let request_options: any = {
  //       method: "POST",
  //       path: "/branch/add",
  //       body: this.addBranchForm.value
  //     };

  //     let response = await this.httpService.http_request(request_options);

  //     this.ngProgress.start();
  // if (response.status == 201) {
  //       this.visible = false;
  //       this.visible1 = true;
  //       this.title = "Branch_List";
  //       this.toaster.showSuccess(
  //         this.operationLanguage.getTranslate("operation_done")
  //       );
  //       // this.currentUser = response.body;
  //       // this.printModal.show();
  //       await this.getAllBranchs();
  //     } else {
  //       this.toaster.showError(response.text);
  //     }
  //   }
  // }

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
        console.log(QRid);

        console.log("onActive >>>>>>>");

        let body = { id: QRid };

        let request_options: any = {
          method: "PUT",
          path: "",
          body: body,
        };
        this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_063");

        let response = await this.httpService.http_request(request_options);
        console.log("esponseesponse" + response.body);

        this.ngProgress.start();
        if (response.status == 200) {
          this.toaster.showSuccess(
            this.operationLanguage.getTranslate("operation_done")
          );
          this.getAllBranchs();
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
          this.toaster.showError(response.text);
        }
      }
    });
  }

  private markFormGroupTouched(controls) {
    // (<any>Object).values(this.addBranchForm.controls).forEach((control) => {
    //   control.markAsTouched();
    // });
    Object.keys(controls).map(function (key) {
      controls[key].markAsTouched();
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

  addMarker($event) {
    this.marker_lat = $event.coords.lat;
    this.marker_long = $event.coords.lng;
  }

  openMap() {
    this.printModal.show();
  }

  closeMap() {
    this.addBranchForm.get("latitude").setValue(this.marker_lat);
    this.addBranchForm.get("longitude").setValue(this.marker_long);
    this.printModal.hide();
  }

  onPage(event) {
    console.log("Page Event", event);
    // this.getQRs(event.offset);
    // this.page(event.offset, event.limit);
  }
  updateFilter(event) {
    const val = event.target.value.toString();
    // filter our data
    const temp = this.temp.filter((d) => {
      return (
        d.code.indexOf(val) !== -1 ||
        !val ||
        d.branchCaption.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val ||
        // d.address.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        // !val ||
        d.statusCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 ||
        !val
      );
    });
    // update the rows
    this.rows = temp;
  }
  // async deleteUser() {
  //   console.log("deleteUser >>>>>>>");

  //   let body = {
  //     id: this.userId
  //   };

  //   let request_options: any = {
  //     method: "DELETE",
  //     path: "/user/delete",
  //     body: body
  //   };

  //   let response = await this.httpService.http_request(request_options);

  //   this.ngProgress.start();
  // if (response.status == 200) {
  //     this.deleteModal.hide();
  //     this.toaster.showSuccess(
  //       this.operationLanguage.getTranslate("operation_done")
  //     );
  //     this.getAllUsers();
  //     this.userId = null;
  //   } else {
  //     this.deleteModal.hide();
  //     this.toaster.showError(response.text);
  //     this.userId = null;
  //   }
  // }

  openCreditDialog(id, name, subWalletId, code): void {
    const dialogRef = this.dialog.open(CreditDialog, {
      width: "500px",
      height: "400px",
      data: { id: id, name: name, subWalletId: subWalletId, code: code },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllBranchs();
      console.log("The dialog was closed");
    });
  }

  openDebitDialog(id, name, subWalletId, code): void {
    const dialogRef = this.dialog.open(DebitDialog, {
      width: "500px",
      height: "400px",
      data: { id: id, name: name, subWalletId: subWalletId, code: code },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllBranchs();
      console.log("The dialog was closed");
    });
  }
}

@Component({
  selector: "credit-dialog",
  templateUrl: "credit-dialog.html",
  styleUrls: ["./branchlist-component.scss"],
})
export class CreditDialog implements OnInit {
  form: FormGroup;
  showOTPForm: boolean = false;
  showFees: boolean = false;
  timeLeft: number = 60;
  interval: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  walletId: any;
  showAlert: boolean = false;
  timeLeft2: number = 30;
  interval2: any;
  disableButton: boolean = false;
  transferFees: any;
  error: string;
  selectedTransferedValue: any;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private toaster: SweetAlertToastService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    public dialogRef: MatDialogRef<CreditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private encryption: Encryption
  ) {}

  async ngOnInit() {
    this.loadForm();
    this.getWalletId();
  }

  loadForm() {
    this.form = new FormGroup({
      amount: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ])
      ),
      otpCode: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ])
      ),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_046");
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
  }

  getFees() {
    // Getting fees
    this.form.get("amount").markAsTouched();
    if (this.form.get("amount").valid) {
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      const headers = new HttpHeaders({
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_130",
        SERVICE_PARAM:
          "amount=" +
          this.form.value.amount +
          "&source=WEB&type=SUBWALLET_CREDIT&walletId=" +
          this.walletId +
          "&accountType=BUS",
      });

      this.ngProgress.start();

      return this.http
        .get<string>(`${environment.secureUrl}`, {
          headers,
          responseType: "text" as "json",
        })
        .subscribe(
          (response) => {
            let transferObj: any = this.encryption.decrypt(response);
            let feesObj: any = transferObj.body;
            this.transferFees = {
              calcFees: feesObj.calcFeesRnd,
              destinationAmount: feesObj.destinationAmountRnd,
              destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
              sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
              sourceCode: feesObj.sourceCode,
              sourceAmountWfees: feesObj.sourceAmountWfees,
            };
            console.log("transferFees", feesObj);
            this.showFees = !this.showFees;

            // this.ngxSmartModalService.getModal("myBootstrapModal").open();
            this.ngProgress.done();
          },
          async (error) => {
            let response: any = this.encryption.decrypt(error.error);
            let response2: any = error;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response2.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        );
    }
  }

  async getOTP(selectedTransferedValue) {
    this.stopTimer();
    if (selectedTransferedValue) {
      if (this.form.value.amount >= 0) {
        this.request_options.method = "POST";
        this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_193");
        this.request_options.body = {
          walletId: this.walletId,
          transactionTypeCode: "SUBWALLET_CREDIT",
          transactionSourceCode: "WEB",
          transactionAmount: this.form.value.amount,
        };
        let response = await this.httpService.http_request(
          this.request_options
        );
        if (response.status == 201) {
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
            console.log("otp", response.body.code);
          } else {
            this.form.get("otpCode").setValue(null);
            this.form.get("otpCode").clearValidators();
            this.form.get("otpCode").updateValueAndValidity();
            this.credit(selectedTransferedValue);
          }
        } else {
          this.showOTPForm = false;
          if (response.status === 500) {
            let error = await this.operationLanguage.getTranslate("tech_issue");
            this.toaster.showError(error);
          }
        }
      }
    }
  }

  async credit(selectedTransferedValue) {
    this.disableButton = true;
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.form.valid) {
      let request_options: any = {
        method: "POST",
        path: "",
        body: {
          subWalletId: this.data.subWalletId,
          sourceCode: "WEB",
          destinationAmount: this.form.value.amount,
          feesFlag: selectedTransferedValue,
          otpCode: this.form.value.otpCode,
        },
      };
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_306");

      let response = await this.httpService.http_request(request_options);
      if (selectedTransferedValue > 0) {
        this.ngProgress.start();
        if (response.status == 200) {
          this.selectedTransferedValue = 0;
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          this.stopTimer();
          this.showOTPForm = false;
          this.showFees = false;
          this.dialogRef.close();
          this.form.reset();
          this.toaster.showSuccess(
            this.operationLanguage.getTranslate("operation_done")
          );
          this.ngProgress.done();
        } else if (response.status == 401) {
          this.authService.logoutUser();
          this.ngProgress.done();
        } else if (response.status == 500) {
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          let tecErr = await this.findAllLanguagesService.getTranslate(
            "tech_issue"
          );
          this.toaster.showError(tecErr);
          this.ngProgress.done();
        } else {
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          this.ngProgress.done();
          this.toaster.showError(response.text);
        }
      } else {
        let msg = await this.findAllLanguagesService.getTranslate(
          "please-select-detuction-fees"
        );

        this.toaster.showError(msg);
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

  cancelOTP() {
    this.showOTPForm = false;
    this.showFees = false;
    this.form.reset();
    this.form.get("otpCode").setValue(null);
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

@Component({
  selector: "debit-dialog",
  templateUrl: "debit-dialog.html",
  styleUrls: ["./branchlist-component.scss"],
})
export class DebitDialog implements OnInit {
  form: FormGroup;
  showOTPForm: boolean = false;
  showFees: boolean = false;
  timeLeft: number = 60;
  interval: any;
  private request_options: any = {
    method: "",
    path: "",
    body: "",
  };
  walletId: any;
  showAlert: boolean = false;
  timeLeft2: number = 30;
  interval2: any;
  disableButton: boolean = false;
  transferFees: any;
  error: string;
  selectedTransferedValue: any;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private toaster: SweetAlertToastService,
    private customValidation: CustomValidation,
    private httpService: HttpService,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public authService: AuthServiceService,
    public findAllLanguagesService: FindAllLanguagesService,
    public ngProgress: NgProgress,
    public dialogRef: MatDialogRef<DebitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private encryption: Encryption
  ) {}

  async ngOnInit() {
    this.loadForm();
    this.getWalletId();
  }

  loadForm() {
    this.form = new FormGroup({
      amount: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(9999.99),
          Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/),
        ])
      ),
      otpCode: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern(/^-?(0|[0-9]\d*)?$/),
        ])
      ),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

  async getWalletId() {
    console.log("AgentBalance >>>>>>>");
    let request_options: any = {
      method: "GET",
      path: "",
    };
    this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_046");
    let response = await this.httpService.http_request(request_options);
    let agentBalance = response.body;
    console.log("agentBalance", response.body);
    this.walletId = agentBalance[0].id;
  }

  getFees() {
    // Getting fees
    this.form.get("amount").markAsTouched();

    if (this.form.get("amount").valid) {
      let token = this.cookieService.get("agt_token");
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      const headers = new HttpHeaders({
        lng: lng.code,
        "x-auth-token": token,
        SERVICE_WRAPPER: "WRMAL_130",
        SERVICE_PARAM:
          "amount=" +
          this.form.value.amount +
          "&source=WEB&type=SUBWALLET_DEPIT&walletId=" +
          this.walletId +
          "&accountType=BUS",
      });

      this.ngProgress.start();

      return this.http
        .get<string>(`${environment.secureUrl}`, {
          headers,
          responseType: "text" as "json",
        })
        .subscribe(
          (response) => {
            let transferObj: any = this.encryption.decrypt(response);
            let feesObj: any = transferObj.body;
            this.transferFees = {
              calcFees: feesObj.calcFeesRnd,
              destinationAmount: feesObj.destinationAmountRnd,
              destinationAmountWOfees: feesObj.destinationAmountWOfeesRnd,
              sourceOperationCurrencyCode: feesObj.sourceOperationCurrencyCode,
              sourceCode: feesObj.sourceCode,
              sourceAmountWfees: feesObj.sourceAmountWfees,
            };
            console.log("transferFees", feesObj);
            this.showFees = !this.showFees;

            // this.ngxSmartModalService.getModal("myBootstrapModal").open();
            this.ngProgress.done();
          },
          async (error) => {
            let response: any = this.encryption.decrypt(error.error);
            let response2: any = error;

            this.error = response.msgWithLanguage;
            if (response.status === 500) {
              this.error = await this.findAllLanguagesService.getTranslate(
                "tech_issue"
              );
            }
            this.toaster.showError(this.error);
            if (response2.status === 401) {
              this.authService.logoutUser();
            }
            this.ngProgress.done();
          }
        );
    }
  }

  async getOTP(selectedTransferedValue) {
    this.stopTimer();
    if (selectedTransferedValue) {
      if (this.form.value.amount >= 0) {
        this.request_options.method = "POST";
        this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_193");
        this.request_options.body = {
          walletId: this.walletId,
          transactionTypeCode: "SUBWALLET_DEPIT",
          transactionSourceCode: "WEB",
          transactionAmount: this.form.value.amount,
        };
        let response = await this.httpService.http_request(
          this.request_options
        );
        if (response.status == 201) {
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
            console.log("otp", response.body.code);
          } else {
            this.form.get("otpCode").setValue(null);
            this.form.get("otpCode").clearValidators();
            this.form.get("otpCode").updateValueAndValidity();
            this.debit(selectedTransferedValue);
          }
        } else {
          this.showOTPForm = false;
          if (response.status === 500) {
            let error = await this.operationLanguage.getTranslate("tech_issue");
            this.toaster.showError(error);
          }
        }
      }
    }
  }

  async debit(selectedTransferedValue) {
    this.disableButton = true;
    (<any>Object).values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.form.valid) {
      let request_options: any = {
        method: "POST",
        path: "",
        body: {
          subWalletId: this.data.subWalletId,
          sourceCode: "WEB",
          destinationAmount: this.form.value.amount,
          feesFlag: selectedTransferedValue,
          otpCode: this.form.value.otpCode,
        },
      };
      this.httpService.setHeader("SERVICE_WRAPPER", "WRMAL_305");

      let response = await this.httpService.http_request(request_options);
      if (selectedTransferedValue > 0) {
        this.ngProgress.start();
        if (response.status == 200) {
          this.selectedTransferedValue = 0;
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          this.stopTimer();
          this.showOTPForm = false;
          this.showFees = false;
          this.dialogRef.close();
          this.form.reset();
          this.toaster.showSuccess(
            this.operationLanguage.getTranslate("operation_done")
          );
          this.ngProgress.done();
        } else if (response.status == 401) {
          this.authService.logoutUser();
          this.ngProgress.done();
        } else if (response.status == 500) {
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          let tecErr = await this.findAllLanguagesService.getTranslate(
            "tech_issue"
          );
          this.toaster.showError(tecErr);
          this.ngProgress.done();
        } else {
          this.timeLeft2 = 30;
          this.disableButtonStartTimer();
          this.ngProgress.done();
          this.toaster.showError(response.text);
        }
      } else {
        let msg = await this.findAllLanguagesService.getTranslate(
          "please-select-detuction-fees"
        );

        this.toaster.showError(msg);
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

  cancelOTP() {
    this.showOTPForm = false;
    this.form.reset();
    this.form.get("otpCode").setValue(null);
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
