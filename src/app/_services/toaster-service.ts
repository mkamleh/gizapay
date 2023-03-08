import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";




@Injectable()
export class toasterService {

  

  constructor( private toastrService: ToastrService ) {
  }
  

  showSuccess(msg) {
    this.toastrService.success(msg);
  }
  
  showError(msg) {
    this.toastrService.error(msg);
  }
  
  showInfo(msg) {
    this.toastrService.info(msg);
  }
  
  showWarning(msg) {
    this.toastrService.warning(msg);
  }

  showSuccessWithTitle(title ,msg) {
    this.toastrService.success(msg, title);
  }

  showErrorWithTitle(title ,msg) {
    this.toastrService.error(msg, title);
  }
  
  showInfoWithTitle(title ,msg) {
    this.toastrService.info(msg, title);
  }
  
  showWarningWithTitle(title ,msg) {
    this.toastrService.warning(msg, title);
  }
  



}
