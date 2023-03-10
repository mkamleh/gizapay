/** @format */

import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { environment } from "../environments/environment";
import { HttpService } from "./_services/HttpService";
import { NgxUiLoaderDemoService } from "./_services/ngx-ui-loader-demo.service";
import { TranslateService } from "@ngx-translate/core";
import { AuthServiceService } from "./_services/authentication-service";

@Component({
  selector: "app-root",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent {
  constructor(
    public translate: TranslateService,
    private router: Router,
    private cookieService: CookieService,
    public authService: AuthServiceService
  ) {
    if (!this.cookieService.check("agtLng")) {
      console.log("not found lng");
      let langObj = environment.defultLang;
      translate.setDefaultLang(langObj.code);
      this.cookieService.set("agtLng", JSON.stringify(langObj));
      // this.cookieService.set("loginLang", JSON.stringify(langObj));
    }
  }

  ngOnInit() {
    if (window.sessionStorage.getItem("agt_token_check") == null) {
      window.sessionStorage.removeItem("agt_token_check");
      window.sessionStorage.clear();
      this.authService.logoutUser();
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(event) {
    if (window.sessionStorage.getItem("agt_token_check") == null) {
      window.sessionStorage.removeItem("agt_token_check");
      window.sessionStorage.clear();
      this.authService.logoutUser();
    }
  }
}
