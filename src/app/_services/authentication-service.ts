/** @format */

import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Injectable()
export class AuthServiceService {
  constructor(private cookieService: CookieService, private router: Router) {}

  public homeUrl: string = "";
  public loginUrl: string = "/authentication/login-signup";
  public isloggedIn: boolean = false;
  public loggedInUser: any;

  logoutUser(): any {
    this.isloggedIn = false;
    this.loggedInUser = null;
    this.cookieService.delete("agt_token");
    sessionStorage.removeItem("agt_token_check");
    this.router.navigate([this.loginUrl]);
  }
}
