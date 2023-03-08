

import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { Encryption } from "./Encryption";


@Injectable()
export class HttpClientService {
  private apiUrl = environment.API_URL;
  private headers: HttpHeaders = new HttpHeaders();
  constructor(private httpClient:HttpClient,    
  private cookieService: CookieService,
  private encryption: Encryption,
  ) {}
  
  //all incoming requestes comes here,sets header and encreptions then redirects to
  //appriopriate method
  httpClientMainRouter(serviceWrapper:string,
    serviceParam:string,
    method:string,
    body?:any,
    Authorization?:string){
    let httpOptions = {
        headers: new HttpHeaders({
            'x-auth-token':  this.cookieService.get("agt_token") || "null",
            'lng': JSON.parse(this.cookieService.get("agtLng")).code || "null",
            'SERVICE_WRAPPER': serviceWrapper,
            'SERVICE_PARAM': serviceParam,
            "content-type": "application/json",
            "Authorization":Authorization || "null"
        }),
        responseType: "text" as 'json'
    };
    body = this.encryption.encrypt(JSON.stringify(body))
    let functi: any
    switch(method){
        case "GET":{
             return this.httpClient.get(this.apiUrl,httpOptions)
        }
        case "POST":{
            return this.httpClient.post(this.apiUrl,body,httpOptions)
        }
        case "PUT":{
            return this.httpClient.put(this.apiUrl,body,httpOptions)
        }
        case "DELETE":{
            functi = this.httpClient.get(this.apiUrl,httpOptions)
        }
    }
  }
}

