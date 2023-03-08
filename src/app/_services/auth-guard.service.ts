/** @format */

import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthServiceService } from "../_services/authentication-service";
import { CookieService } from "ngx-cookie-service";
import { HttpService } from "./HttpService";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;

    console.log("canActivate");
    console.log(
      "window.sessionStorage",
      window.sessionStorage.getItem("agt_token_check")
    );
    console.log(this.cookieService.check("agt_token"));

    if (this.cookieService.check("agt_token")) {
      this.authService.homeUrl = url;
      return true;
    }
    this.router.navigate([this.authService.loginUrl]);
    this.cookieService.delete("agt_token");
    return false;
  }
}
