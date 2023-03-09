/** @format */

import { Injectable } from "@angular/core";
import { toasterService } from "./toaster-service";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Encryption } from "./Encryption";
import { HttpClientService } from "./HttpClientService";
import { SharedService } from "./shared-service";

@Injectable()
export class operationLanguage {
  languages: Array<string> = [];

  constructor(
    private toster: toasterService,
    public translate: TranslateService,
    public encryption: Encryption,
    private httpClientService:HttpClientService,
    private _sharedServices: SharedService
  ) {}

  getAllLanguage() {
    return this.httpClientService.httpClientMainRouter("WRMAL_118",`null`,"GET").subscribe( res=>{
      let body = this._sharedServices.decrypt(res).body;
      body.map(lngs => {
        this.languages.push(lngs);
      })
    },err =>{
    });
  }

  removeAllLanguage() {
    this.languages = [];
  }

  getTranslate(key: string): string {
    let value: string;
    this.translate.get(key).subscribe(res => {
      value = res;
    });
    return value;
  }
}
