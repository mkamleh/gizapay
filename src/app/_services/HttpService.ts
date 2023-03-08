/** @format */

import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from "../../environments/environment";
import { CookieService } from "ngx-cookie-service";
import { AuthServiceService } from "../_services/authentication-service";
import { Encryption } from "../_services/Encryption";
import { toasterService } from "./toaster-service";

@Injectable()
export class HttpService {
  private apiUrl = environment.secureUrl;
  private headers: Headers = new Headers();
  private options: RequestOptions = new RequestOptions();
  private path;
  constructor(
    private toaster: toasterService,
    private cookieService: CookieService,
    private http: Http,
    private encryption: Encryption,
    private authService: AuthServiceService
  ) {}
  setHeader(key: string, value: string) {
    this.headers.set(key, value);
  }
  removeHeader(key: string) {
    this.headers.delete(key);
  }
  async http_request(request_options: any): Promise<any> {
    if (this.cookieService.check("agt_token")) {
      this.headers.set("x-auth-token", this.cookieService.get("agt_token"));
    }
    if (this.cookieService.check("agtLng")) {
      let lng = JSON.parse(this.cookieService.get("agtLng"));
      this.headers.set("lng", lng.code);
    }
    this.options.headers = this.headers;
    this.options.method = request_options.method;
    if (request_options.body) {
      this.options.body = request_options.body
        ? this.encryption.encrypt(JSON.stringify(request_options.body))
        : {};
    }
    this.path = request_options.path;
    let http_response = await this.http
      .request(this.apiUrl + this.path, this.options)
      .toPromise()
      .then((response) => this.encryption.decrypt(response.text()))
      .catch((err: any) => {
        err
          ? console.log(err, "errrrrrrrror")
          : console.log("error not fouund");

        let response: any;
        switch (err.status) {
          case 401:
            this.authService.logoutUser();
            response = err;
            break;

          case 404:
            console.log(this.encryption.decrypt(err.text()), "response1");

            response = this.encryption.decrypt(err.text());
            console.log(response, "response2");

            this.toaster.showError(response.msgWithLanguage);
            break;

          case 500:
            response = this.encryption.decrypt(err.text());
            this.toaster.showError(response.msgWithLanguage);

            break;
          case 400:
            console.log("hi from 400 error")
            response = this.encryption.decrypt(err.text());
            //if response.msgWithLanguage contains more than one err, split then and 
            //print toast them all
            if(response.msgWithLanguage.includes("/n")){
              let newRes = response.msgWithLanguage.split("\n");
              console.log(newRes,"newRes before loop")
              for (let i = 0; i < newRes.length - 1; i++) {
                console.log(newRes[i])
                this.toaster.showError(newRes[i]),"insdide loop";
              }
            }else{
              let newRes = response.msgWithLanguage;
              this.toaster.showError(newRes),"insdide loop";
            }
            break;

          default:
            response = this.encryption.decrypt(err.text());
            console.log("responseMsg", response);

            this.toaster.showError(response.msgWithLanguage);

            break;
        }
        return response;
      });
    return http_response;
  }
}
