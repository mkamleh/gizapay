/** @format */

import { Component, OnInit } from "@angular/core";
import { SharedService } from "app/_services/shared-service";
import { AuthServiceService } from "app/_services/authentication-service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "app/_services/HttpService";
import { CookieService } from "ngx-cookie-service";
import { NgProgress } from "ngx-progressbar";
import { SweetAlertToastService } from "app/_services/sweet-alert-toast.service";
import { FindAllLanguagesService } from "app/_services/find-all-languages.service";
import { HttpClientService } from "app/_services/HttpClientService";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  pageTitle: string = "USER PROFILE";

  masterUser: any = {};

  constructor(
    private router: Router,
    public translate: TranslateService,
    private httpService: HttpService,
    private cookieService: CookieService,
    public authService: AuthServiceService,
    private _sharedService: SharedService,
    public ngProgress: NgProgress,
    private toaster: SweetAlertToastService,
    public findAllLanguagesService: FindAllLanguagesService,
    private httpClientService: HttpClientService,
  ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit() {
    console.log(
      " this.authService.loggedInUser",
      this.authService.loggedInUser
    );
    this.refresh();
  }

  refresh() {
    if (this.cookieService.check("agt_token")) {
      this.httpClientService.httpClientMainRouter("WRMAL_007",`null`,"GET")
      .subscribe( res => {
        let response = this._sharedService.decrypt(res)
        this.authService.loggedInUser = response.body;
        if (response.body.userRoleCode == "MASTER") {
          this.masterUser = response.body.agentProfileResource;
        } else {
          this.masterUser = response.body.agentProfileResource;
        }
      },err =>{
      });
     
    }
  }
}
