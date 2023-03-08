import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthServiceService } from "./authentication-service";
import { toasterService } from "./toaster-service";
import { Encryption } from "./Encryption";

@Injectable()
export class ErrorHandling {
    constructor(
        private authService: AuthServiceService,
        private toaster: toasterService,
        private encryption: Encryption,
    ) {}

    handleErrorMsg(error:HttpErrorResponse | any){
        console.log(error,"hi from errorhandling modue")
        if (error.status === 401){
            this.authService.logoutUser();
            return
        }
        let response = this.encryption.decrypt(error.error)
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
    }
        
}