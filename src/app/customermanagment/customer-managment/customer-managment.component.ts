/** @format */

import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { AdminLayoutComponent } from "app/layouts/admin/admin-layout.component";

import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { HttpService } from "app/_services/HttpService";
import { environment } from "environments/environment";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { SharedService } from "app/_services/shared-service";
import { Router } from "@angular/router";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { AuthServiceService } from "app/_services/authentication-service";
import Swal from "sweetalert2";
import { Encryption } from "app/_services/Encryption";
import { HttpClientService } from "app/_services/HttpClientService";

const newPassword = new FormControl("", Validators.required);
const confirmPassword = new FormControl(
  "",
  CustomValidators.equalTo(newPassword)
);
@Component({
  selector: "app-customer-managment",
  templateUrl: "./customer-managment.component.html",
  styleUrls: ["./customer-managment.component.scss"],
})
export class CustomerManagmentComponent implements OnInit {
  pageTitle: any = "Customer Management";

  showInfo: boolean = false;
  changePasswordForm: FormGroup;
  error: any;
  walletCode;
  walletType = 1;
  accountInfo: any;
  showErrorMsg: boolean;
  password: any;
  resetPasswordInfo: any;
  errorMsg: string;
  defaultImage = "assets/images/agent_defualt.png";

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    public ngProgress: NgProgress,
    public adminLayout: AdminLayoutComponent,
    public fb: FormBuilder,
    private httpService: HttpService,
    private httpClientService: HttpClientService,
    public findAllLanguagesService: FindAllLanguagesService,
    public _sharedService: SharedService,
    private router: Router,
    private toaster: SweetAlertToastService,
    public authService: AuthServiceService,
    private encryption: Encryption
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    this.loadresetPasswordForm();
    console.log("im here");
  }
  loadresetPasswordForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.compose([Validators.required])],
      newPassword: newPassword,
      confirmNewPassword: confirmPassword,
    });
  }
  getWalletInfo() {
    if (this.walletCode) {
      this.httpClientService.httpClientMainRouter("WRMAL_186",`mobileNo=${this.walletCode}`,"GET").subscribe( res=>{
        let response = this._sharedService.decrypt(res)
        this.accountInfo = response.body;
        this.showErrorMsg = false;
        this.showInfo = true; 
      },err =>{
      });
    } else {
      this.toaster.showError(
        "You need to Insert Wallet Code to be able to search wallet"
      );
    }
  }

  openResetPassword() {
    var card = document.querySelector(".js-profile-card");
    card.classList.add("active");
  }

  async resetPassword() {
    Swal({
      title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findAllLanguagesService.getTranslate(
        "Yes!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        this.ngProgress.start();
        if (this.accountInfo) {
          this.httpClientService.httpClientMainRouter("WRMAL_176",`mobileNo=${this.walletCode}`,"POST",{ id: this.accountInfo.accountId })
          .subscribe( async res=>{
            let response = this._sharedService.decrypt(res)
            let searchedObj: any = this.encryption.decrypt(response);
            this.resetPasswordInfo = searchedObj.body;
            let success = await this.findAllLanguagesService.getTranslate(
              "operation_done"
            );
            this.toaster.showSuccess(success);
            this.showErrorMsg = false;
            this.showInfo = true;
            this.ngProgress.done();
          },err =>{
          })
        }
      }
    });
  }

  cancelPassword() {
    console.log("cancelPassword");
    var card = document.querySelector(".js-profile-card");
    card.classList.remove("active");
  }

  async changeStatus() {
    Swal({
      title: await this.findAllLanguagesService.getTranslate("Are you sure?"),
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: await this.findAllLanguagesService.getTranslate(
        "Yes!"
      ),
      cancelButtonText: await this.findAllLanguagesService.getTranslate(
        "cancel"
      ),
    }).then(async (result) => {
      if (result.value) {
        this.ngProgress.start();
        if (this.accountInfo) {
          this.httpClientService.httpClientMainRouter("WRMAL_181",`mobileNo=${this.walletCode}`,"POST",{ id: this.accountInfo.accountId })
          .subscribe( async res=>{
            let changeStatusBody = this._sharedService.decrypt(res)
            this.accountInfo.statusId = changeStatusBody.body.statusId;
            this.accountInfo.statusCode = changeStatusBody.body.statusCode;
            let stat =
              this.accountInfo.statusId == 1 ? "Blocked" : "Unblocked";
            this.toaster.showSuccess(`User is ${stat}`);
            this.showErrorMsg = false;
            this.showInfo = true;
          },err =>{
          })
        }
      }
    });
  }
}
