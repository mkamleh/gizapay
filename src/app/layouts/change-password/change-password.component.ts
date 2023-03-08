/** @format */

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MenuItems } from "../../shared/menu-items/menu-items";
import { HorizontalMenuItems } from "../../shared/menu-items/horizontal-menu-items";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import PerfectScrollbar from "perfect-scrollbar";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { environment } from "../../../environments/environment";
import "rxjs/add/operator/map";
import { CookieService } from "ngx-cookie-service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { AuthServiceService } from "app/_services/authentication-service";
import { operationLanguage } from "app/_services/operationLanguage-service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { NgProgress } from "ngx-progressbar";
import { toasterService } from "app/_services/toaster-service";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { CustomValidators } from "ng2-validation";
import { HttpService } from "app/_services/HttpService";
import { SharedService } from "app/_services/shared-service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { HttpClientService } from "app/_services/HttpClientService";

const newPassword = new FormControl(
  "",
  Validators.compose([
    Validators.required,
    Validators.minLength(4),
    // Validators.pattern(
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+!=./*_(),])(?=\S+$).{8,}$/
    // ),
  ])
);
const confirmPassword = new FormControl(
  "",
  Validators.compose([
    Validators.required,
    CustomValidators.equalTo(newPassword),
  ])
);
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  error: any;
  layoutDir;
  pageTitle: string = "change_password";
  showErrorMsg: boolean;
  errorMsg: any;
  constructor(
    private router: Router,
    public menuItems: MenuItems,
    public horizontalMenuItems: HorizontalMenuItems,
    public translate: TranslateService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private authService: AuthServiceService,
    public ngProgress: NgProgress,
    private toaster1: toasterService,
    private toaster: SweetAlertToastService,
    private operationLanguage: operationLanguage,
    public _sharedService: SharedService,
    public findAllLanguagesService: FindAllLanguagesService,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.compose([Validators.required])],
      newPassword: newPassword,
      confirmNewPassword: confirmPassword,
    });
    let lng = JSON.parse(this.cookieService.get("agtLng"));
    this.layoutDir = lng.direction;
  }

  ngOnInit() {}

  async changePassword() {
    this.ngProgress.start();
    console.log(this.changePasswordForm.value);
    let data = {
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmNewPassword,
      password: this.changePasswordForm.value.oldPassword,
    };

    if (this.changePasswordForm.valid) {
      this.httpClientService.httpClientMainRouter("WRMAL_038",`null`,"PUT",data)
      .subscribe( async res => {
        this.toaster.showSuccess(
          await this.findAllLanguagesService.getTranslate("password_changed")
        );
        this.changePasswordForm.reset();
        Object.keys(this.changePasswordForm.controls).forEach((key) => {
          this.changePasswordForm.get(key).setErrors(null);
        });
      },err =>{
      });
    }
  }
}
