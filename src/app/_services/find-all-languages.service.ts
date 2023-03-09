/** @format */

import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Encryption } from "./Encryption";
import { HttpClientService } from "./HttpClientService";
import { SharedService } from "./shared-service";

@Injectable({
  providedIn: "root"
})
export class FindAllLanguagesService {
  constructor( 
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
