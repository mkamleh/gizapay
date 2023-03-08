/** @format */

import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { FindAllLanguagesService } from "./find-all-languages.service";

@Injectable()
export class SweetAlertToastService {
  constructor(public findAllLanguagesService: FindAllLanguagesService) {}

  showSuccess(msg, doSth?) {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      background: "rgb(76, 57, 22)"
    });

    toast({
      type: "success",
      // title: await this.findAllLanguagesService.getTranslate("Success")
      html: `<strong style="color:#fff; font-weight: bold;">${msg}</strong>`
    });
  }

  showError(msg, doSth?) {
    const toast = Swal.mixin({
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      background: "#ba0000"
    });

    toast({
      type: "error",
      // title: await this.findAllLanguagesService.getTranslate("Success")
      html: `<strong style="color:white ; font-weight: bold;">${msg}</strong>`
    });
  }
}
