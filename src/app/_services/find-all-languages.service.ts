/** @format */

import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Http } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Encryption } from "./Encryption";
import { HttpClientService } from "./HttpClientService";
import { SharedModule } from "app/shared/shared.module";
import { SharedService } from "./shared-service";

@Injectable({
  providedIn: "root"
})
export class FindAllLanguagesService {
  constructor(private http: HttpClient, 
    public translate: TranslateService,
    private httpClientService: HttpClientService,
    private _sharedServices: SharedService,
    public encryption: Encryption) {}
  languages: any = [];
  // Getting the Languages


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



  async getTranslate(key: string): Promise<any> {
    let value: string;
    await this.translate.get(key).subscribe(res => {
      value = res;
    });
    return value;
  }
}
